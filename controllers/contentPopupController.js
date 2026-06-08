const { ContentPopup } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

function coerceBoolean(value, whenMissing) {
  if (value === undefined || value === null || value === "") return whenMissing;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v === "true" || v === "1") return true;
    if (v === "false" || v === "0") return false;
  }
  return Boolean(value);
}

function toUploadPath(file) {
  if (!file?.path) return null;
  return file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
}

function unlinkIfExists(filePath) {
  if (!filePath || typeof filePath !== "string") return;
  const normalized = filePath.replace(/^\//, "");
  const diskPath = `public/${normalized}`;
  if (fs.existsSync(diskPath)) {
    try {
      fs.unlinkSync(diskPath);
    } catch (_) {
      /* ignore */
    }
  }
}

exports.getAllContentPopups = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(req.query.page, req.query.per_page);
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: contentPopups, count } = await ContentPopup.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        contentPopups,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Popup listesi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getContentPopupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await ContentPopup.findByPk(id);
    if (!row) {
      return res.status(404).json({ success: 0, data: null, message: "Açılır pencere bulunamadı." });
    }
    return res.json({ success: 1, data: row, message: "Popup detayı." });
  } catch (err) {
    next(err);
  }
};

exports.createContentPopup = async (req, res, next) => {
  try {
    const {
      title,
      description,
      starts_at,
      ends_at,
      redirect_url,
      is_active,
    } = req.body;

    const uploaded = toUploadPath(req.file);

    const row = await ContentPopup.create({
      title: title === "" ? null : title ?? null,
      description: description === "" ? null : description ?? null,
      starts_at: starts_at === "" ? null : starts_at ?? null,
      ends_at: ends_at === "" ? null : ends_at ?? null,
      redirect_url: redirect_url === "" ? null : redirect_url ?? null,
      image_url: uploaded,
      is_active: coerceBoolean(is_active, true),
    });

    return res.status(201).json({
      success: 1,
      data: row,
      message: "Popup oluşturuldu.",
    });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.updateContentPopup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await ContentPopup.findByPk(id);
    if (!row) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: 0, data: null, message: "Açılır pencere bulunamadı." });
    }

    const {
      title,
      description,
      starts_at,
      ends_at,
      redirect_url,
      is_active,
      clear_image,
    } = req.body;

    const uploaded = toUploadPath(req.file);
    const removeImage = clear_image === "1" || clear_image === "true";

    const patch = {
      ...(title !== undefined ? { title: title === "" ? null : title } : {}),
      ...(description !== undefined ? { description: description === "" ? null : description } : {}),
      ...(starts_at !== undefined ? { starts_at: starts_at === "" ? null : starts_at } : {}),
      ...(ends_at !== undefined ? { ends_at: ends_at === "" ? null : ends_at } : {}),
      ...(redirect_url !== undefined ? { redirect_url: redirect_url === "" ? null : redirect_url } : {}),
      ...(is_active !== undefined ? { is_active: coerceBoolean(is_active, row.is_active) } : {}),
    };

    if (uploaded) {
      if (row.image_url) unlinkIfExists(row.image_url);
      patch.image_url = uploaded;
    } else if (removeImage) {
      if (row.image_url) unlinkIfExists(row.image_url);
      patch.image_url = null;
    }

    await row.update(patch);
    await row.reload();
    return res.json({ success: 1, data: row, message: "Popup güncellendi." });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.deleteContentPopup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await ContentPopup.findByPk(id);
    if (!row) {
      return res.status(404).json({ success: 0, data: null, message: "Açılır pencere bulunamadı." });
    }
    if (row.image_url) unlinkIfExists(row.image_url);
    await row.destroy();
    return res.json({ success: 1, data: null, message: "Popup silindi." });
  } catch (err) {
    next(err);
  }
};
