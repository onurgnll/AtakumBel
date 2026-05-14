const { News, NewsGallery, sequelize } = require("../models");

const SPOT_MAX_LEN = 50;
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
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

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  if (req.file) return [req.file];
  return [];
};

//Read
exports.getAllNews = async (req, res, next) => {
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
    const { rows: news, count } = await News.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["content"] },
      limit,
      offset,
      include: [
        {
          model: NewsGallery,
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
  let transaction;
  try {
    const { title, spot, content, is_active } = req.body;
    const uploadedFiles = getUploadedFiles(req);
    if (spot == null || String(spot).trim() === "") {
      uploadedFiles.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Spot (özet) zorunludur.",
      });
    }
    if (String(spot).length > SPOT_MAX_LEN) {
      uploadedFiles.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        success: 0,
        data: null,
        message: `Spot (özet) en fazla ${SPOT_MAX_LEN} karakter olabilir.`,
      });
    }
    const existingNews = await News.findOne({ where: { title } });
    if (existingNews) {
      uploadedFiles.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Bu başlıkta bir haber zaten var.",
      });
    }
    transaction = await sequelize.transaction();
    const newNews = await News.create({
      title,
      spot,
      content,
      publish_date: new Date(),
      is_active: coerceBoolean(is_active, true),
      view_count: 0,
    }, { transaction });

    if (uploadedFiles.length > 0) {
      await Promise.all(
        uploadedFiles.map((file, index) =>
          NewsGallery.create(
            {
              news_id: newNews.id,
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

    return res
      .status(201)
      .json({ success: 1, data: newNews, message: "Haber eklendi." });
  } catch (err) {
    if (transaction) await transaction.rollback();
    const uploadedFiles = getUploadedFiles(req);
    uploadedFiles.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    next(err);
  }
};

//Update
exports.updateNews = async (req, res, next) => {
  let transaction;
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
    await newsItem.update({
      title: title ?? newsItem.title,
      spot: spot ?? newsItem.spot,
      content: content ?? newsItem.content,
      is_active: coerceBoolean(is_active, newsItem.is_active),
    });

    const uploadedFiles = getUploadedFiles(req);
    if (uploadedFiles.length > 0) {
      transaction = await sequelize.transaction();
      await NewsGallery.update(
        { is_main: false },
        { where: { news_id: newsItem.id, is_main: true }, transaction },
      );
      const maxOrder = await NewsGallery.max("order", { where: { news_id: newsItem.id } });
      const startOrder = Number(maxOrder) > 0 ? Number(maxOrder) + 1 : 1;
      await Promise.all(
        uploadedFiles.map((file, index) =>
          NewsGallery.create(
            {
              news_id: newsItem.id,
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

    return res.json({
      success: 1,
      data: newsItem,
      message: "Haber güncellendi.",
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

