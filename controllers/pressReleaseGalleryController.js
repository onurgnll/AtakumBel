const { PressReleaseGallery, sequelize } = require("../models");
const fs = require("fs");

exports.getGalleryByPressReleaseId = async (req, res, next) => {
  try {
    const { press_release_id } = req.params;
    const images = await PressReleaseGallery.findAll({
      where: { press_release_id },
      order: [["order", "ASC"]],
    });
    res.json({ success: 1, data: images, message: "Galeri listelendi." });
  } catch (err) {
    next(err);
  }
};

exports.addImageToGallery = async (req, res, next) => {
  try {
    const { press_release_id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Dosya yüklenmedi.",
      });
    }
    const currentCount = await PressReleaseGallery.count({
      where: { press_release_id },
    });
    const galleryData = req.files.map((file, index) => {
      const isFirstImage = currentCount === 0 && index === 0;

      return {
        press_release_id,
        image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
        order: currentCount + index + 1,
        is_main: isFirstImage,
      };
    });

    const newImages = await PressReleaseGallery.bulkCreate(galleryData);

    res.json({
      success: 1,
      data: newImages,
      message: "Görseller başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await PressReleaseGallery.findByPk(id);

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

exports.setMainImage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { press_release_id } = req.body;

    await PressReleaseGallery.update(
      { is_main: false },
      { where: { press_release_id }, transaction: t },
    );
    await PressReleaseGallery.update(
      { is_main: true },
      { where: { id }, transaction: t },
    );

    await t.commit();
    res.json({
      success: 1,
      data: PressReleaseGallery,
      message: "Ana görsel güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
