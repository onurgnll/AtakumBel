const { Council, CouncilMember } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

//Read
exports.getAllCouncils = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: councils, count } = await Council.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: CouncilMember,
          as: "members",
          attributes: ["id", "first_name", "last_name", "political_party"],
        },
      ],
    });
    return res.json({
      success: 1,
      data: councils,
      total: count,
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createCouncil = async (req, res, next) => {
  try {
    const { term_name, is_active } = req.body;

    if (is_active === true) {
      await Council.update(
        { is_active: false },
        { where: { is_active: true } },
      );
    }

    const newCouncil = await Council.create({
      term_name,
      is_active: is_active ?? true,
    });

    return res.status(201).json({
      success: 1,
      data: newCouncil,
      message: "Yeni meclis başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateCouncil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { term_name, is_active } = req.body;

    const council = await Council.findByPk(id);
    if (!council) {
      return res
        .status(404)
        .json({ success: 0, message: "Meclis dönemi bulunamadı." });
    }
    if (is_active === true) {
      await Council.update(
        { is_active: false },
        { where: { is_active: true } },
      );
    }

    await council.update({
      term_name: term_name ?? council.term_name,
      is_active: is_active ?? council.is_active,
    });

    return res.json({
      success: 1,
      data: council,
      message: "Meclis dönemi bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteCouncil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const council = await Council.findByPk(id);

    if (!council) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek kayıt bulunamadı.",
      });
    }
    await council.destroy();

    return res.json({
      success: 1,
      data: null,
      message: "Meclis dönemi ve bağlı kayıtlar başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
