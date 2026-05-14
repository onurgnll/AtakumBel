const { FacilityGallery, sequelize } = require("../models");
const fs = require("fs");

//Create
exports.addImageToGallery = async (req, res, next) => {
  try {
    const { facility_id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Dosya yüklenmedi.",
      });
    }
    const currentCount = await FacilityGallery.count({
      where: { facility_id },
    });
    const galleryData = req.files.map((file, index) => {
      const isFirstImage = currentCount === 0 && index === 0;

      return {
        facility_id: facility_id,
        image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
        order: currentCount + index + 1,
        is_main: isFirstImage,
      };
    });

    const newImages = await FacilityGallery.bulkCreate(galleryData);

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
    const image = await FacilityGallery.findByPk(id);

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
    const { facility_id } = req.body;

    await FacilityGallery.update(
      { is_main: false },
      { where: { facility_id }, transaction: t },
    );
    await FacilityGallery.update(
      { is_main: true },
      { where: { id }, transaction: t },
    );

    await t.commit();
    res.json({
      success: 1,
      data: FacilityGallery,
      message: "Ana görsel güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

