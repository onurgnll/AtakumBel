const { NewsGallery, sequelize } = require("../models");
const fs = require("fs");

//Create
exports.addImageToGallery = async (req, res, next) => {
  try {
    const { news_id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Dosya yüklenmedi.",
      });
    }
    const currentCount = await NewsGallery.count({
      where: { news_id },
    });
    const galleryData = req.files.map((file, index) => {
      const isFirstImage = currentCount === 0 && index === 0;

      return {
        news_id: news_id,
        image_url: file.path.replace(/\\/g, "/"),
        order: currentCount + index + 1,
        is_main: isFirstImage,
      };
    });

    const newImages = await NewsGallery.bulkCreate(galleryData);

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
    const image = await NewsGallery.findByPk(id);

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
    const { news_id } = req.body;

    await NewsGallery.update(
      { is_main: false },
      { where: { news_id }, transaction: t },
    );
    await NewsGallery.update(
      { is_main: true },
      { where: { id }, transaction: t },
    );

    await t.commit();
    res.json({
      success: 1,
      data: NewsGallery,
      message: "Ana görsel güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
