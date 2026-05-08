const { Event, EventGallery, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  if (req.file) return [req.file];
  return [];
};

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
          where: { is_main: true },
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
      message: "Etkinlikler baÅŸarÄ±yla listelendi.",
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
      res
        .status(404)
        .json({ success: 0, data: null, message: "Etkinlik bulunamadÄ±." });
    }
    res.json({
      success: 1,
      data: event,
      message: "Etkinlik detaylarÄ± getirildi.",
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
    const formatDate = (dateStr) => {
      if (!dateStr || !dateStr.includes(".")) return dateStr;
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    };
    const event = await Event.findByPk(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Etkinlik bulunamadÄ±." });
    }
    await event.update({
      title: title ?? event.title,
      type: type ?? event.type,
      start_date: formatDate(start_date) ?? event.start_date,
      end_date: formatDate(end_date) ?? event.end_date,
      event_time: event_time ?? event.event_time,
      address: address ?? event.address,
      description: description ?? event.description,
    });

    const uploadedFiles = getUploadedFiles(req);
    if (uploadedFiles.length > 0) {
      transaction = await sequelize.transaction();
      await EventGallery.update(
        { is_main: false },
        { where: { event_id: event.id, is_main: true }, transaction },
      );
      const maxOrder = await EventGallery.max("order", { where: { event_id: event.id } });
      const startOrder = Number(maxOrder) > 0 ? Number(maxOrder) + 1 : 1;
      await Promise.all(
        uploadedFiles.map((file, index) =>
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
      message: "Etkinlik baÅŸarÄ±yla gÃ¼ncellendi.",
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    const uploadedFiles = getUploadedFiles(req);
    uploadedFiles.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
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
    } = req.body;

    const formatDate = (dateStr) => {
      if (!dateStr || !dateStr.includes(".")) return dateStr;
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    };

    const existingEvent = await Event.findOne({ where: { title } });
    const uploadedFiles = getUploadedFiles(req);
    if (existingEvent) {
      uploadedFiles.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res
        .status(400)
        .json({
          success: 0,
          data: null,
          message: "Bu baÅŸlÄ±kta bir etkinlik zaten var.",
        });
    }

    transaction = await sequelize.transaction();
    const newEvent = await Event.create({
      title,
      type,
      start_date: formatDate(start_date),
      end_date: formatDate(end_date),
      event_time,
      address,
      description,
    }, { transaction });

    if (uploadedFiles.length > 0) {
      await Promise.all(
        uploadedFiles.map((file, index) =>
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
      .json({ success: 1, data: newEvent, message: "Etkinlik oluÅŸturuldu." });
  } catch (err) {
    if (transaction) await transaction.rollback();
    const uploadedFiles = getUploadedFiles(req);
    uploadedFiles.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
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
        .json({ success: 0, data: null, message: "Etkinlik bulunamadÄ±." });
    }
    const imagesToDelete = event.gallery
      ? event.gallery.map((img) => img.image_url)
      : [];
    await event.destroy();

    imagesToDelete.forEach((path) => {
      if (path && fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    res.json({
      success: 1,
      data: null,
      message: "Etkinlik ve galerisi baÅŸarÄ±yla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

