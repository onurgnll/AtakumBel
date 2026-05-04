const { Event, EventGallery, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

//Read
exports.getAllEvents = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { type } = req.query;

    const whereCondition = type ? { type } : {};

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
      res
        .status(404)
        .json({ success: 0, data: null, message: "Etkinlik bulunamadı." });
    }
    res.json({
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
        .json({ success: 0, data: null, message: "Etkinlik bulunamadı." });
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
    res.json({
      success: 1,
      data: event,
      message: "Etkinlik başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createEvent = async (req, res, next) => {
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
    if (existingEvent) {
      return res
        .status(400)
        .json({
          success: 0,
          data: null,
          message: "Bu başlıkta bir etkinlik zaten var.",
        });
    }

    const newEvent = await Event.create({
      title,
      type,
      start_date: formatDate(start_date),
      end_date: formatDate(end_date),
      event_time,
      address,
      description,
    });

    res
      .status(201)
      .json({ success: 1, data: newEvent, message: "Etkinlik oluşturuldu." });
  } catch (err) {
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
    await event.destroy();

    imagesToDelete.forEach((path) => {
      if (path && fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    res.json({
      success: 1,
      data: null,
      message: "Etkinlik ve galerisi başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
