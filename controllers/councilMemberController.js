const { Council, CouncilMember, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

//Read
exports.getAllCouncilMembers = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: members, count } = await CouncilMember.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Council,
          as: "council",
          attributes: ["id", "term_name"],
          where: { is_active: true },
        },
      ],
      order: [["id", "ASC"]],
    });
    return res.json({
      success: 1,
      data: {
        members,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Meclis üyeleri başarıyla getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.addMemberToCouncil = async (req, res, next) => {
  try {
    const { council_id, first_name, last_name, political_party } = req.body;
    const council = await Council.findByPk(council_id);
    if (!council) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Üye eklemek istediğiniz meclis bulunamadı.",
      });
    }
    const existingMember = await CouncilMember.findOne({
      where: {
        first_name,
        last_name,
        council_id,
      },
    });
    if (existingMember) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({
        success: 0,
        message: "Bu üye bu meclis döneminde zaten kayıtlı.",
      });
    }
    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : null;
    const member = await CouncilMember.create({
      council_id,
      first_name,
      last_name,
      political_party,
      image_url: image_path,
    });

    return res.status(201).json({
      success: 1,
      data: member,
      message: "Meclis üyesi başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await CouncilMember.findByPk(id);

    if (!member) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: 0, message: "Güncellenecek üye bulunamadı." });
    }

    const { first_name, last_name, political_party, council_id } = req.body;
    let image_path = member.image_url;
    if (req.file) {
      if (member.image_url && fs.existsSync(member.image_url)) {
        fs.unlinkSync(member.image_url);
      }
      image_path = req.file.path.replace(/\\/g, "/");
    }

    await member.update({
      first_name: first_name ?? member.first_name,
      last_name: last_name ?? member.last_name,
      political_party: political_party ?? member.political_party,
      council_id: council_id ?? member.council_id,
      image_url: image_path,
    });

    return res.json({
      success: 1,
      data: member,
      message: "Meclis üyesi bilgileri başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await CouncilMember.findByPk(id);

    if (!member) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Silinecek üye bulunamadı." });
    }
    if (member.image_url && fs.existsSync(member.image_url)) {
      fs.unlinkSync(member.image_url);
    }

    await member.destroy();

    return res.json({
      success: 1,
      data: null,
      message: "Meclis üyesi ve bağlı tüm dosyalar başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
