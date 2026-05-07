const { CouncilDecision } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

const normalizeFiles = (existingFiles, bodyFiles, uploadedFile) => {
  const files = Array.isArray(existingFiles) ? [...existingFiles] : [];

  if (bodyFiles) {
    if (Array.isArray(bodyFiles)) {
      files.push(...bodyFiles);
    } else if (typeof bodyFiles === "string") {
      try {
        const parsed = JSON.parse(bodyFiles);
        if (Array.isArray(parsed)) files.push(...parsed);
        else files.push(bodyFiles);
      } catch {
        files.push(bodyFiles);
      }
    }
  }

  if (uploadedFile) {
    files.push(uploadedFile.path.replace(/\\/g, "/"));
  }

  return files;
};

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
        message: "meclis kararları listelendi",
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
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    const newDecision = await CouncilDecision.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedFile),
    });

    res.status(201).json({
      success: 1,
      data: newDecision,
      message: "Karar başarıyla eklendi.",
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
        .json({ success: 0, data: null, message: "Karar bulunamadı." });
    }
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    const updatedDecision = await decision.update({
      title: title ?? decision.title,
      description: description ?? decision.description,
      publish_date: publish_date ?? decision.publish_date,
      is_active: is_active ?? decision.is_active,
      files: normalizeFiles(decision.files, files, uploadedFile),
    });
    res.json({
      success: 1,
      data: updatedDecision,
      message: "Karar başarıyla güncellendi.",
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
