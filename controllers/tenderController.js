const { Tender } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
} = require("../helpers/normalizeUploadFiles");

//Read
exports.getAllTenders = async (req, res, next) => {
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

    const { rows: tenders, count } = await Tender.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        tenders,
        pagination: getPagingData(count, req.query.page, limit),
        message: "Ä°haleler baÅŸarÄ±yla listelendi.",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTenderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);
    if (!tender) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Ä°hale bulunamadÄ±." });
    }
    res.json({ success: 1, data: tender, message: "Ä°hale bilgisi getirildi." });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createTender = async (req, res, next) => {
  try {
    const { title, description, publish_date, is_active, files } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: 0, data: null, message: "title zorunludur." });
    }
    const uploadedList = collectUploadedFiles(req);

    const newTender = await Tender.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedList),
    });

    res.status(201).json({
      success: 1,
      data: newTender,
      message: "Ä°hale kaydÄ± baÅŸarÄ±yla oluÅŸturuldu.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateTender = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, publish_date, is_active, files } = req.body;

    const tender = await Tender.findByPk(id);
    if (!tender) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "GÃ¼ncellenecek ihale bulunamadÄ±.",
      });
    }

    const uploadedList = collectUploadedFiles(req);

    await tender.update({
      title: title ?? tender.title,
      description: description ?? tender.description,
      publish_date: publish_date ?? tender.publish_date,
      is_active: is_active ?? tender.is_active,
      files: normalizeFiles(tender.files, files, uploadedList),
    });

    res.json({
      success: 1,
      data: tender,
      message: "Ä°hale bilgileri baÅŸarÄ±yla gÃ¼ncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteTender = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);

    if (!tender) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Ä°hale bulunamadÄ±." });
    }

    const filesToDelete = Array.isArray(tender.files) ? tender.files : [];
    await tender.destroy();
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    res.json({ success: 1, data: null, message: "Ä°hale kaydÄ± silindi." });
  } catch (err) {
    next(err);
  }
};

