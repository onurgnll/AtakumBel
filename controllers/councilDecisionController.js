const { CouncilDecision } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
} = require("../helpers/normalizeUploadFiles");

//Read
exports.getAllDecisions = async (req, res, next) => {
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

    const { rows: decisions, count } = await CouncilDecision.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        ["publish_date", "DESC"],
        ["id", "DESC"],
      ],
    });

    return res.json({
      success: 1,
      data: {
        decisions,
        pagination: getPagingData(count, req.query.page, limit),
        message: "meclis kararlarÄ± listelendi",
      },
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createDecision = async (req, res, next) => {
  try {
    const { title, description, publish_date, is_active, files } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: 0, data: null, message: "title zorunludur." });
    }
    const uploadedList = collectUploadedFiles(req);

    const newDecision = await CouncilDecision.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedList),
    });

    res.status(201).json({
      success: 1,
      data: newDecision,
      message: "Karar baÅŸarÄ±yla eklendi.",
    });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};

//Update
exports.updateDecision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, publish_date, is_active, files } = req.body;
    const decision = await CouncilDecision.findByPk(id);
    if (!decision) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Karar bulunamadÄ±." });
    }
    const uploadedList = collectUploadedFiles(req);

    const updatedDecision = await decision.update({
      title: title ?? decision.title,
      description: description ?? decision.description,
      publish_date: publish_date ?? decision.publish_date,
      is_active: is_active ?? decision.is_active,
      files: normalizeFiles(decision.files, files, uploadedList),
    });
    res.json({
      success: 1,
      data: updatedDecision,
      message: "Karar baÅŸarÄ±yla gÃ¼ncellendi.",
    });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};

//Delete
exports.deleteDecision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const decision = await CouncilDecision.findByPk(id);

    if (!decision) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Karar bulunamadÄ±." });
    }

    const filesToDelete = Array.isArray(decision.files) ? decision.files : [];
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    await decision.destroy();
    res.json({
      success: 1,
      data: null,
      message: "Karar baÅŸarÄ±yla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

