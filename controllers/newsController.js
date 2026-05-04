const { News, NewsGallery, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

//Read
exports.getAllNews = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const isAdmin = req.query.admin === "true";
    const whereCondition = isAdmin ? {} : { is_active: true };
    const { rows: news, count } = await News.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["content"] },
      limit,
      offset,
      include: [
        {
          model: NewsGallery,
          as: "gallery",
          where: { is_main: true },
          required: false,
        },
      ],
      order: [["publish_date", "DESC"]],
      distinct: true,
    });

    return res.json({
      success: 1,
      data: {
        news,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "haberler (özet) listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findByPk(id, {
      include: [{ model: NewsGallery, as: "gallery" }],
    });

    if (!newsItem) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Görüntülenecek haber bulunamadı.",
      });
    }

    await newsItem.increment("view_count", { by: 1 });
    return res.json({
      success: 1,
      data: newsItem,
      message: "Haber detayı ve tam içeriği getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createNews = async (req, res, next) => {
  try {
    const { title, spot, content, is_active } = req.body;
    const existingNews = await News.findOne({ where: { title } });
    if (existingNews) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Bu başlıkta bir haber zaten var.",
      });
    }
    const newNews = await News.create({
      title,
      spot,
      content,
      publish_date: new Date(),
      is_active,
      view_count: 0,
    });
    return res
      .status(201)
      .json({ success: 1, data: newNews, message: "Haber eklendi." });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findByPk(id);
    const { title, spot, content, is_active } = req.body;
    if (!newsItem) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek haber bulunamadı.",
      });
    }
    await newsItem.update({
      title: title ?? newsItem.title,
      spot: spot ?? newsItem.spot,
      content: content ?? newsItem.content,
      is_active: is_active ?? newsItem.is_active,
    });
    return res.json({
      success: 1,
      data: newsItem,
      message: "Haber güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findByPk(id, {
      include: [{ model: NewsGallery, as: "gallery" }],
    });

    if (!newsItem) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek haber bulunamadı.",
      });
    }

    const imagesToDelete = newsItem.gallery
      ? newsItem.gallery.map((img) => img.image_url)
      : [];

    await newsItem.destroy();

    imagesToDelete.forEach((path) => {
      if (path && fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    return res.json({
      success: 1,
      data: null,
      message: "Haber başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
