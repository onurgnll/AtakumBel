const {
  Encumen,
  EncumenMembership,
  Employee,
  CouncilMember,
  sequelize,
} = require("../models");

//Read
exports.getEncumenWithMembers = async (req, res, next) => {
  try {
    const encumen = await Encumen.findOne({
      include: [
        {
          model: EncumenMembership,
          as: "memberships",
        },
      ],
      order: [[{ model: EncumenMembership, as: "memberships" }, "id", "ASC"]],
    });

    if (!encumen) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Encümen kurulu bulunamadı.",
      });
    }

    const membersWithData = await Promise.all(
      encumen.memberships.map(async (membership) => {
        const isStaff = membership.member_type === "staff";
        const Model = isStaff ? Employee : CouncilMember;

        const specificAttributes = isStaff
          ? ["first_name", "last_name", "title", "image_url"]
          : ["first_name", "last_name", "political_party", "image_url"];

        const memberData = await Model.findByPk(membership.member_id, {
          attributes: specificAttributes,
        });
        return {
          ...membership.toJSON(),
          details: memberData,
          subtitle: isStaff ? memberData?.title : memberData?.political_party,
        };
      }),
    );
    return res.json({
      success: 1,
      data: {
        ...encumen.toJSON(),
        memberships: membersWithData,
      },
      message: "Encümen kurulu ve üyeleri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.addMemberToEncumen = async (req, res, next) => {
  try {
    const { encumen_id, member_type, member_id } = req.body;

    if (!["staff", "council_member"].includes(member_type)) {
      return res
        .status(400)
        .json({ success: 0, message: "Geçersiz üye tipi." });
    }

    const Model = member_type === "staff" ? Employee : CouncilMember;
    const exists = await Model.findByPk(member_id);

    if (!exists) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: `${member_type === "staff" ? "Personel" : "Meclis üyesi"} bulunamadı.`,
      });
    }
    const alreadyMember = await EncumenMembership.findOne({
      where: { encumen_id, member_type, member_id },
    });

    if (alreadyMember) {
      return res.status(409).json({
        success: 0,
        data: alreadyMember,
        message: "Bu kişi zaten encümen kurulunda kayıtlı.",
      });
    }

    const newMembership = await EncumenMembership.create({
      encumen_id,
      member_type,
      member_id,
    });

    res.status(201).json({
      success: 1,
      data: newMembership,
      message: "Üye encümene başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.removeMemberFromEncumen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const membership = await EncumenMembership.findByPk(id);

    if (!membership) {
      return res
        .status(404)
        .json({ success: 0, message: "Üyelik kaydı bulunamadı." });
    }

    await membership.destroy();
    res.json({
      success: 1,
      data: null,
      message: "Üye encümen kurulundan çıkarıldı.",
    });
  } catch (err) {
    next(err);
  }
};
