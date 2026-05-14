const { PublicNotice } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  if (req.file) return [req.file];
  return [];
};

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

  if (Array.isArray(uploadedFile)) {
    uploadedFile.forEach((file) => {
      files.push(
        file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
      );
    });
  } else if (uploadedFile) {
    files.push(
      uploadedFile.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
    );
  }

  return files;
};

// Read
exports.getAllNotices = async (req, res, next) => {
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

    const { rows: notices, count } = await PublicNotice.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes: ["id", "title", "description", "publish_date", "is_active", "files"],
      order: [["id", "DESC"]],
      distinct: true,
    });

    return res.json({
      success: 1,
      data: {
        notices,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Duyurular listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getNoticeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await PublicNotice.findByPk(id);

    if (!notice) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İlan bulunamadı." });
    }

    res.json({
      success: 1,
      data: notice,
      message: "İlan detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createNotice = async (req, res, next) => {
  try {
    const {
      title,
      description,
      publish_date,
      is_active,
      files,
    } = req.body;
    if (!title) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "title zorunludur.",
      });
    }
    const uploadedFiles = getUploadedFiles(req);

    const newNotice = await PublicNotice.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedFiles),
    });

    res.status(201).json({
      success: 1,
      data: newNotice,
      message: "Duyuru başarıyla oluşturuldu.",
    });
  } catch (err) {
    const filesToClean = getUploadedFiles(req);
    filesToClean.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    next(err);
  }
};

//Update
exports.updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await PublicNotice.findByPk(id);
    const {
      title,
      description,
      publish_date,
      is_active,
      files,
    } = req.body;

    if (!notice) {
      getUploadedFiles(req).forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İlan bulunamadı." });
    }

    const uploadedFiles = getUploadedFiles(req);

    const previousFiles = Array.isArray(notice.files) ? notice.files : [];
    const hasFilesPayload = files !== undefined;
    const nextFiles = hasFilesPayload
      // If client sends files field, treat it as the new source of truth.
      ? normalizeFiles([], files, uploadedFiles)
      // Otherwise keep existing files and append newly uploaded ones.
      : normalizeFiles(previousFiles, undefined, uploadedFiles);

    // Remove physical files that were explicitly removed by the client.
    const removedFiles = previousFiles.filter((filePath) => !nextFiles.includes(filePath));
    removedFiles.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await notice.update({
      title: title ?? notice.title,
      description: description ?? notice.description,
      publish_date: publish_date ?? notice.publish_date,
      is_active: is_active ?? notice.is_active,
      files: nextFiles,
    });

    return res.json({
      success: 1,
      data: notice,
      message: "İlan bilgisi güncellendi.",
    });
  } catch (err) {
    getUploadedFiles(req).forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    next(err);
  }
};

//Delete
exports.deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await PublicNotice.findByPk(id);
    if (!notice) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İlan bulunamadı." });
    }
    const filesToDelete = Array.isArray(notice.files) ? notice.files : [];

    await notice.destroy();

    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    res.json({
      success: 1,
      data: null,
      message: "İlan ve bağlı dosyası silindi.",
    });
  } catch (err) {
    next(err);
  }
};

