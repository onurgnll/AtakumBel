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
            { decision_no: { [Op.iLike]: `%${search}%` } },
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
        message: "meclis kararları listelendi",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getDecisionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const decision = await CouncilDecision.findByPk(id);
    if (!decision) {
      return res.status(404).json({ success: 0, data: null, message: "Karar bulunamadı." });
    }
    return res.json({
      success: 1,
      data: decision,
      message: "Karar getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createDecision = async (req, res, next) => {
  try {
    const {
      title,
      description,
      publish_date,
      is_active,
      files,
      decision_no,
      date,
    } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: 0, data: null, message: "title zorunludur." });
    }
    const uploadedList = collectUploadedFiles(req);

    const trimmedNo =
      decision_no != null && String(decision_no).trim() !== ""
        ? String(decision_no).trim()
        : null;
    const dateOnly =
      date != null && String(date).trim() !== ""
        ? String(date).trim().slice(0, 10)
        : null;

    const newDecision = await CouncilDecision.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      decision_no: trimmedNo,
      date: dateOnly,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedList),
    });

    res.status(201).json({
      success: 1,
      data: newDecision,
      message: "Karar başarıyla eklendi.",
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
    const {
      title,
      description,
      publish_date,
      is_active,
      files,
      decision_no,
      date,
    } = req.body;
    const decision = await CouncilDecision.findByPk(id);
    if (!decision) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Karar bulunamadı." });
    }
    const uploadedList = collectUploadedFiles(req);

    const nextDecisionNo =
      decision_no !== undefined
        ? decision_no != null && String(decision_no).trim() !== ""
          ? String(decision_no).trim()
          : null
        : decision.decision_no;
    const nextDate =
      date !== undefined
        ? date != null && String(date).trim() !== ""
          ? String(date).trim().slice(0, 10)
          : null
        : decision.date;

    const updatedDecision = await decision.update({
      title: title ?? decision.title,
      description: description ?? decision.description,
      publish_date: publish_date ?? decision.publish_date,
      decision_no: nextDecisionNo,
      date: nextDate,
      is_active: is_active ?? decision.is_active,
      files: normalizeFiles(decision.files, files, uploadedList),
    });
    res.json({
      success: 1,
      data: updatedDecision,
      message: "Karar başarıyla güncellendi.",
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
        .json({ success: 0, data: null, message: "Karar bulunamadı." });
    }

    const filesToDelete = Array.isArray(decision.files) ? decision.files : [];
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    await decision.destroy();
    res.json({
      success: 1,
      data: null,
      message: "Karar başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

