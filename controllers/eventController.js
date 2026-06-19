const { Event, EventGallery, sequelize } = require("../models");
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

/** Gün.aa.yyyy veya YYYY-MM-DD → YYYY-MM-DD; boş → null */
function normalizeEventDate(dateStr) {
  if (dateStr == null || String(dateStr).trim() === "") return null;
  const s = String(dateStr).trim();
  if (s.includes(".")) {
    const [day, month, year] = s.split(".");
    if (!year || !month || !day) return s.slice(0, 10);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`.slice(0, 10);
  }
  return s.slice(0, 10);
}

function toYmdStored(v) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return normalizeEventDate(String(v));
}

//Read
exports.getAllEvents = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { type } = req.query;
    const search = req.query.search ? req.query.search.trim() : null;

    const whereCondition = type ? { type } : {};
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: events, count } = await Event.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["description"] },
      include: [
        {
          model: EventGallery,
          as: "gallery",
          required: false,
        },
      ],
      limit,
      offset,
      order: [["start_date", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        events,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Etkinlikler başarıyla listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        { model: EventGallery, as: "gallery", order: [["order", "ASC"]] },
      ],
    });
    if (!event) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Etkinlik bulunamadı." });
    }
    return res.json({
      success: 1,
      data: event,
      message: "Etkinlik detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateEvent = async (req, res, next) => {
  let transaction;
  try {
    const { id } = req.params;
    const {
      title,
      type,
      start_date,
      end_date,
      event_time,
      address,
      description,
    } = req.body;
    const event = await Event.findByPk(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Etkinlik bulunamadı." });
    }
    const galleryUploads = collectGalleryImages(req);
    const nextStart =
      start_date !== undefined
        ? normalizeEventDate(start_date)
        : toYmdStored(event.start_date);
    const nextEnd =
      end_date !== undefined
        ? normalizeEventDate(end_date)
        : toYmdStored(event.end_date);
    if (nextStart && nextEnd && nextStart > nextEnd) {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
      });
    }

    const { files } = req.body;
    const docUploads = collectUploadedFiles(req);
    const prevFiles = Array.isArray(event.files) ? event.files : [];
    const nextFiles =
      files !== undefined || docUploads.length
        ? normalizeFiles(prevFiles, files, docUploads)
        : prevFiles;
    if (files !== undefined || docUploads.length) {
      syncRemovedAttachmentFiles(prevFiles, nextFiles);
    }

    await event.update({
      title: title ?? event.title,
      type: type ?? event.type,
      start_date:
        start_date !== undefined
          ? normalizeEventDate(start_date)
          : event.start_date,
      end_date:
        end_date !== undefined ? normalizeEventDate(end_date) : event.end_date,
      event_time:
        event_time !== undefined ? event_time || null : event.event_time,
      address: address !== undefined ? address || null : event.address,
      description: description ?? event.description,
      files: nextFiles,
    });

    if (galleryUploads.length > 0) {
      transaction = await sequelize.transaction();
      await EventGallery.update(
        { is_main: false },
        { where: { event_id: event.id, is_main: true }, transaction },
      );
      const maxOrder = await EventGallery.max("order", { where: { event_id: event.id } });
      const startOrder = Number(maxOrder) > 0 ? Number(maxOrder) + 1 : 1;
      await Promise.all(
        galleryUploads.map((file, index) =>
          EventGallery.create(
            {
              event_id: event.id,
              image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
              order: startOrder + index,
              is_main: index === 0,
            },
            { transaction },
          ),
        ),
      );
      await transaction.commit();
    }

    res.json({
      success: 1,
      data: event,
      message: "Etkinlik başarıyla güncellendi.",
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    unlinkUploadedFiles(req);
    next(err);
  }
};

//Create
exports.createEvent = async (req, res, next) => {
  let transaction;
  try {
    const {
      title,
      type,
      start_date,
      end_date,
      event_time,
      address,
      description,
      files,
    } = req.body;

    const galleryUploads = collectGalleryImages(req);
    const docUploads = collectUploadedFiles(req);
    const startNorm = normalizeEventDate(start_date);
    const endNorm = normalizeEventDate(end_date);
    if (startNorm && endNorm && startNorm > endNorm) {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
      });
    }

    const existingEvent = await Event.findOne({ where: { title } });
    if (existingEvent) {
      unlinkUploadedFiles(req);
      return res
        .status(400)
        .json({
          success: 0,
          data: null,
          message: "Bu başlıkta bir etkinlik zaten var.",
        });
    }

    transaction = await sequelize.transaction();
    const newEvent = await Event.create({
      title,
      type,
      start_date: startNorm,
      end_date: endNorm,
      event_time: event_time || null,
      address: address || null,
      description,
      files: normalizeFiles([], files, docUploads),
    }, { transaction });

    if (galleryUploads.length > 0) {
      await Promise.all(
        galleryUploads.map((file, index) =>
          EventGallery.create(
            {
              event_id: newEvent.id,
              image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
              order: index + 1,
              is_main: index === 0,
            },
            { transaction },
          ),
        ),
      );
    }
    await transaction.commit();

    res
      .status(201)
      .json({ success: 1, data: newEvent, message: "Etkinlik oluşturuldu." });
  } catch (err) {
    if (transaction) await transaction.rollback();
    unlinkUploadedFiles(req);
    next(err);
  }
};
// Delete
exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [{ model: EventGallery, as: "gallery" }],
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Etkinlik bulunamadı." });
    }
    const imagesToDelete = event.gallery
      ? event.gallery.map((img) => img.image_url)
      : [];
    const filesToDelete = Array.isArray(event.files) ? event.files : [];
    await event.destroy();

    imagesToDelete.forEach((path) => {
      if (path && fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });
    deleteStoredFilePaths(filesToDelete);

    res.json({
      success: 1,
      data: null,
      message: "Etkinlik ve galerisi başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

