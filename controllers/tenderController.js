const { Tender } = require("../models");
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
        message: "İhaleler başarıyla listelendi.",
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
        .json({ success: 0, data: null, message: "İhale bulunamadı." });
    }
    res.json({ success: 1, data: tender, message: "İhale bilgisi getirildi." });
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
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    const newTender = await Tender.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedFile),
    });

    res.status(201).json({
      success: 1,
      data: newTender,
      message: "İhale kaydı başarıyla oluşturuldu.",
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
        message: "Güncellenecek ihale bulunamadı.",
      });
    }

    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    await tender.update({
      title: title ?? tender.title,
      description: description ?? tender.description,
      publish_date: publish_date ?? tender.publish_date,
      is_active: is_active ?? tender.is_active,
      files: normalizeFiles(tender.files, files, uploadedFile),
    });

    res.json({
      success: 1,
      data: tender,
      message: "İhale bilgileri başarıyla güncellendi.",
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
        .json({ success: 0, data: null, message: "İhale bulunamadı." });
    }

    const filesToDelete = Array.isArray(tender.files) ? tender.files : [];
    await tender.destroy();
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    res.json({ success: 1, data: null, message: "İhale kaydı silindi." });
  } catch (err) {
    next(err);
  }
};
