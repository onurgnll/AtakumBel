const { EventGallery, Event, sequelize } = require("../models");
const fs = require("fs");

//Read
exports.getGalleryByEventId = async (req, res, next) => {
  try {
    const { event_id } = req.params;
    const images = await EventGallery.findAll({
      where: { event_id },
      order: [["order", "ASC"]],
    });
    res.json({ success: 1, data: images, message: "Galeri listelendi." });
  } catch (err) {
    next(err);
  }
};

//Create
exports.addImageToGallery = async (req, res, next) => {
  try {
    const { event_id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Dosya yüklenmedi.",
      });
    }
    const currentCount = await EventGallery.count({ where: { event_id } });
    const galleryData = req.files.map((file, index) => {
      const isFirstImage = currentCount === 0 && index === 0;

      return {
        event_id,
        image_url: file.path.replace(/\\/g, "/"),
        order: currentCount + index + 1,
        is_main: isFirstImage,
      };
    });

    const newImages = await EventGallery.bulkCreate(galleryData);

    res.json({
      success: 1,
      data: newImages,
      message: "Görseller başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await EventGallery.findByPk(id);

    if (!image) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Görsel bulunamadı." });
    }
    if (fs.existsSync(image.image_url)) {
      fs.unlinkSync(image.image_url);
    }

    await image.destroy();
    res.json({ success: 1, data: null, message: "Görsel başarıyla silindi." });
  } catch (err) {
    next(err);
  }
};

//Update
exports.setMainImage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { event_id } = req.body;

    await EventGallery.update(
      { is_main: false },
      { where: { event_id }, transaction: t },
    );
    await EventGallery.update(
      { is_main: true },
      { where: { id }, transaction: t },
    );

    await t.commit();
    res.json({
      success: 1,
      data: EventGallery,
      message: "Ana görsel güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
