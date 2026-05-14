const { PresidentGallery, sequelize } = require("../models");
const fs = require("fs");

//Read
exports.getPresidentGallery = async (req, res, next) => {
  try {
    const { president_id } = req.params;
    const gallery = await PresidentGallery.findAll({
      where: { president_id },
      order: [["order", "ASC"]],
    });

    res.json({
      success: 1,
      data: gallery,
      message: "Başkan galeri görüntüleri getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.addImagesToPresidentGallery = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { president_id } = req.params;
    let files = [];
    if (req.files) {
      files = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: 0,
        message: "Dosya yüklenmedi. Lütfen görselleri seçtiğinizden emin olun.",
      });
    }
    await PresidentGallery.update(
      { is_main: false },
      { where: { president_id }, transaction: t },
    );

    const lastImage = await PresidentGallery.findOne({
      where: { president_id },
      order: [["order", "DESC"]],
      transaction: t,
    });

    let currentOrder = lastImage ? lastImage.order : 0;

    const galleryData = files.map((file, index) => ({
      president_id,
      image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
      order: currentOrder + index + 1,
      is_main: index === 0,
    }));

    const newImages = await PresidentGallery.bulkCreate(galleryData, {
      transaction: t,
    });

    await t.commit();
    res.json({
      success: 1,
      data: newImages,
      message: "Görseller başarıyla eklendi.",
    });
  } catch (err) {
    if (req.files) {
      const filesToClean = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();

      filesToClean.forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    await t.rollback();
    next(err);
  }
};

//Update
exports.setMainImage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { president_id } = req.body;

    await PresidentGallery.update(
      { is_main: false },
      { where: { president_id }, transaction: t },
    );
    await PresidentGallery.update(
      { is_main: true },
      { where: { id }, transaction: t },
    );

    await t.commit();
    res.json({
      success: 1,
      data: PresidentGallery,
      message: "Ana görsel güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//Delete
exports.deletePresidentGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await PresidentGallery.findByPk(id);

    if (!image) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Resim bulunamadı." });
    }

    if (fs.existsSync(image.image_url)) {
      fs.unlinkSync(image.image_url);
    }
    await image.destroy();

    res.json({
      success: 1,
      data: null,
      message: "Resim galeriden tamamen silindi.",
    });
  } catch (err) {
    next(err);
  }
};

