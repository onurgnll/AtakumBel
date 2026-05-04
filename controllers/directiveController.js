const { Directive } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

//Read
exports.getAllDirectives = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: directives, count } = await Directive.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["publish_date", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        directives,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Genelgeler listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getDirectiveById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const directive = await Directive.findByPk(id);
    if (!directive) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Genelge bulunamadı." });
    }
    res.json({
      success: 1,
      data: directive,
      message: "Genelge detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createDirective = async (req, res, next) => {
  try {
    const { title, description, publish_date } = req.body;
    const existing = await Directive.findOne({ where: { title } });
    if (existing) {
      return res.status(409).json({
        success: 0,
        data: null,
        message: "Bu başlıkta bir genelge zaten mevcut.",
      });
    }

    const newDirective = await Directive.create({
      title,
      description,
      publish_date: new Date(),
    });

    res.status(201).json({
      success: 1,
      data: newDirective,
      message: "Genelge başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateDirective = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, publish_date } = req.body;

    const directive = await Directive.findByPk(id);

    if (!directive) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Genelge bulunamadı." });
    }

    await directive.update({
      title,
      description,
      publish_date,
    });

    res.json({
      success: 1,
      data: directive,
      message: "Genelge başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteDirective = async (req, res, next) => {
  try {
    const { id } = req.params;
    const directive = await Directive.findByPk(id);

    if (!directive) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Genelge bulunamadı." });
    }

    await directive.destroy();
    res.json({
      success: 1,
      data: null,
      message: "Genelge sistemden kaldırıldı.",
    });
  } catch (err) {
    next(err);
  }
};
