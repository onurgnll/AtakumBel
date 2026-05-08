const { PhotoGallery } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

const normalizeImagePath = (filePath) =>
  filePath.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");

const deleteIfExists = (filePath) => {
  if (!filePath) return;
  const raw = String(filePath).replace(/\\/g, "/");
  const normalized = raw.startsWith("/uploads/") ? `public${raw}` : raw;
  if (fs.existsSync(normalized)) fs.unlinkSync(normalized);
};

exports.getAllPhotos = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(req.query.page, req.query.per_page);
    const where = req.query.is_active === "false" ? {} : { is_active: true };

    const { rows: items, count } = await PhotoGallery.findAndCountAll({
      where,
      limit,
      offset,
      order: [["order", "ASC"], ["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        items,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Foto galeri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createPhotos = async (req, res, next) => {
  try {
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Yuklenecek gorsel bulunamadi.",
      });
    }

    const maxOrder = await PhotoGallery.max("order");
    const startOrder = Number(maxOrder) > 0 ? Number(maxOrder) + 1 : 1;

    const created = await PhotoGallery.bulkCreate(
      uploadedFiles.map((file, index) => ({
        image_url: normalizeImagePath(file.path),
        order: startOrder + index,
        is_active: true,
      })),
    );

    return res.status(201).json({
      success: 1,
      data: created,
      message: "Foto galeri gorselleri eklendi.",
    });
  } catch (err) {
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    uploadedFiles.forEach((file) => deleteIfExists(file?.path));
    next(err);
  }
};

exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await PhotoGallery.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Gorsel bulunamadi.",
      });
    }

    deleteIfExists(item.image_url);
    await item.destroy();

    return res.json({
      success: 1,
      data: null,
      message: "Gorsel silindi.",
    });
  } catch (err) {
    next(err);
  }
};
