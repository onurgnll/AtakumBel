const { PressRelease, PressReleaseGallery, sequelize } = require("../models");

const SPOT_MAX_LEN = 50;
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const {
  normalizeFiles,
  collectUploadedFiles,
  collectGalleryImages,
  unlinkUploadedFiles,
  deleteStoredFilePaths,
  syncRemovedAttachmentFiles,
} = require("../helpers/normalizeUploadFiles");
const fs = require("fs");
const { Op } = require("sequelize");

function coerceBoolean(value, whenMissing) {
  if (value === undefined || value === null || value === "") {
    return whenMissing;
  }
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.toLowerCase();
    if (v === "true" || v === "1") return true;
    if (v === "false" || v === "0") return false;
  }
  return Boolean(value);
}

exports.getAllPressReleases = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const isAdmin = req.query.admin === "true";
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = isAdmin ? {} : { is_active: true };
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { spot: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { rows: press_releases, count } = await PressRelease.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["content"] },
      limit,
      offset,
      include: [
        {
          model: PressReleaseGallery,
          as: "gallery",
          required: false,
        },
      ],
      order: [["publish_date", "DESC"]],
      distinct: true,
    });

    return res.json({
      success: 1,
      data: {
        press_releases,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Basın bültenleri (özet) listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getPressReleaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await PressRelease.findByPk(id, {
      include: [{ model: PressReleaseGallery, as: "gallery" }],
    });

    if (!item) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Görüntülenecek basın bülteni bulunamadı.",
      });
    }

    await item.increment("view_count", { by: 1 });
    return res.json({
      success: 1,
      data: item,
      message: "Basın bülteni detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createPressRelease = async (req, res, next) => {
  let transaction;
  try {
    const { title, spot, content, is_active, files } = req.body;
    const galleryUploads = collectGalleryImages(req);
    const docUploads = collectUploadedFiles(req);
    if (spot == null || String(spot).trim() === "") {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Spot (özet) zorunludur.",
      });
    }
    if (String(spot).length > SPOT_MAX_LEN) {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: `Spot (özet) en fazla ${SPOT_MAX_LEN} karakter olabilir.`,
      });
    }
    const existing = await PressRelease.findOne({ where: { title } });
    if (existing) {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Bu başlıkta bir basın bülteni zaten var.",
      });
    }
    transaction = await sequelize.transaction();
    const created = await PressRelease.create(
      {
        title,
        spot,
        content,
        publish_date: new Date(),
        is_active: coerceBoolean(is_active, true),
        view_count: 0,
        files: normalizeFiles([], files, docUploads),
      },
      { transaction },
    );

    if (galleryUploads.length > 0) {
      await Promise.all(
        galleryUploads.map((file, index) =>
          PressReleaseGallery.create(
            {
              press_release_id: created.id,
              image_url: file.path
                .replace(/\\/g, "/")
                .replace(/^.*?(\/uploads\/)/, "/uploads/"),
              order: index + 1,
              is_main: index === 0,
            },
            { transaction },
          ),
        ),
      );
    }
    await transaction.commit();

    return res.status(201).json({
      success: 1,
      data: created,
      message: "Basın bülteni eklendi.",
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    unlinkUploadedFiles(req);
    next(err);
  }
};

exports.updatePressRelease = async (req, res, next) => {
  let transaction;
  try {
    const { id } = req.params;
    const item = await PressRelease.findByPk(id);
    const { title, spot, content, is_active, files } = req.body;
    if (!item) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek basın bülteni bulunamadı.",
      });
    }
    if (spot !== undefined && spot !== null) {
      const spotStr = String(spot);
      if (spotStr.trim() === "") {
        return res.status(400).json({
          success: 0,
          data: null,
          message: "Spot (özet) zorunludur.",
        });
      }
      if (spotStr.length > SPOT_MAX_LEN) {
        return res.status(400).json({
          success: 0,
          data: null,
          message: `Spot (özet) en fazla ${SPOT_MAX_LEN} karakter olabilir.`,
        });
      }
    }
    const docUploads = collectUploadedFiles(req);
    const prevFiles = Array.isArray(item.files) ? item.files : [];
    const nextFiles =
      files !== undefined || docUploads.length
        ? normalizeFiles(prevFiles, files, docUploads)
        : prevFiles;
    if (files !== undefined || docUploads.length) {
      syncRemovedAttachmentFiles(prevFiles, nextFiles);
    }

    await item.update({
      title: title ?? item.title,
      spot: spot ?? item.spot,
      content: content ?? item.content,
      is_active: coerceBoolean(is_active, item.is_active),
      files: nextFiles,
    });

    const galleryUploads = collectGalleryImages(req);
    if (galleryUploads.length > 0) {
      transaction = await sequelize.transaction();
      await PressReleaseGallery.update(
        { is_main: false },
        { where: { press_release_id: item.id, is_main: true }, transaction },
      );
      const maxOrder = await PressReleaseGallery.max("order", {
        where: { press_release_id: item.id },
      });
      const startOrder = Number(maxOrder) > 0 ? Number(maxOrder) + 1 : 1;
      await Promise.all(
        galleryUploads.map((file, index) =>
          PressReleaseGallery.create(
            {
              press_release_id: item.id,
              image_url: file.path
                .replace(/\\/g, "/")
                .replace(/^.*?(\/uploads\/)/, "/uploads/"),
              order: startOrder + index,
              is_main: index === 0,
            },
            { transaction },
          ),
        ),
      );
      await transaction.commit();
    }

    return res.json({
      success: 1,
      data: item,
      message: "Basın bülteni güncellendi.",
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    unlinkUploadedFiles(req);
    next(err);
  }
};

exports.deletePressRelease = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await PressRelease.findByPk(id, {
      include: [{ model: PressReleaseGallery, as: "gallery" }],
    });

    if (!item) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek basın bülteni bulunamadı.",
      });
    }

    const imagesToDelete = item.gallery
      ? item.gallery.map((img) => img.image_url)
      : [];
    const filesToDelete = Array.isArray(item.files) ? item.files : [];

    await item.destroy();

    imagesToDelete.forEach((path) => {
      if (path && fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });
    deleteStoredFilePaths(filesToDelete);

    return res.json({
      success: 1,
      data: null,
      message: "Basın bülteni silindi.",
    });
  } catch (err) {
    next(err);
  }
};
