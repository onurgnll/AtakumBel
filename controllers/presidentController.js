const { President, PresidentGallery, sequelize } = require("../models");
const fs = require("fs");

//Read
exports.getPresident = async (req, res, next) => {
  try {
    const president = await President.findOne();
    if (!president) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Başkan bilgisi bulunamadı.",
      });
    }
    res.json({
      success: 1,
      data: president,
      message: "Başkan bilgileri getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getPresidentMessage = async (req, res, next) => {
  try {
    const president = await President.findOne({
      attributes: ["first_name", "last_name", "message", "president_image_url"],
      order: [["id", "DESC"]],
    });

    if (!president) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Kayıtlı başkan mesajı bulunamadı.",
      });
    }

    return res.json({
      success: 1,
      data: president,
      message: "Güncel başkan mesajı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create-Update
exports.upsertPresident = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { first_name, last_name, biography, message } = req.body;
    let president = await President.findOne();

    let finalProfileImage = president ? president.president_image_url : "";
    const uploadedFile =
      req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (uploadedFile) {
      if (
        president?.president_image_url &&
        fs.existsSync(president.president_image_url)
      ) {
        fs.unlinkSync(president.president_image_url);
      }
      finalProfileImage = uploadedFile.path.replace(/\\/g, "/");
    }

    const presidentData = {
      first_name: first_name ?? president?.first_name,
      last_name: last_name ?? president?.last_name,
      biography: biography ?? president?.biography,
      message: message ?? president?.message,
      president_image_url: finalProfileImage,
    };

    if (president) {
      await president.update(presidentData, { transaction: t });
    } else {
      president = await President.create(presidentData, { transaction: t });
    }

    await t.commit();
    res.json({
      success: 1,
      data: president,
      message: "Başkan bilgileri başarıyla güncellendi.",
    });
  } catch (err) {
    const fileToCleanup =
      req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    if (fileToCleanup && fs.existsSync(fileToCleanup.path)) {
      fs.unlinkSync(fileToCleanup.path);
    }

    await t.rollback();
    next(err);
  }
};
