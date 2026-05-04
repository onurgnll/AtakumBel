const { VicePresident, Department } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

//Read
exports.getAllVicePresidents = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: vice_presidents, count } =
      await VicePresident.findAndCountAll({
        limit,
        offset,
        include: [
          { model: Department, as: "department", attributes: ["name"] },
        ],
      });
    if (vice_presidents.length === 0) {
      return res.json({
        success: 1,
        data: {
          vice_presidents: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "Görüntülenecek başkan yadımcısı bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: {
        vice_presidents,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Başkan yardımcıları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createVicePresident = async (req, res, next) => {
  try {
    const { first_name, last_name, biography, department_id } = req.body;

    const existingVicePresident = await VicePresident.findOne({
      where: {
        first_name,
        last_name,
      },
    });
    if (existingVicePresident) {
      return res.status(409).json({
        success: 0,
        data: existingVicePresident,
        message: "Bu başkan yardımcısı zaten kayıtlı.",
      });
    }

    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const newVicePresident = await VicePresident.create({
      first_name,
      last_name,
      biography,
      department_id,
      image_url: image_path,
    });
    res.status(201).json({
      success: 1,
      data: newVicePresident,
      message: "Başkan yardımcısı eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateVicePresident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vice_president = await VicePresident.findByPk(id);

    if (!vice_president) {
      return res.status(404).json({ success: 0, message: "Kayıt bulunamadı." });
    }

    const { first_name, last_name, biography } = req.body;
    let image_path = vice_president.image_url;

    if (req.file) {
      if (vice_president.image_url && fs.existsSync(vice_president.image_url)) {
        fs.unlinkSync(vice_president.image_url);
      }
      image_path = req.file.path.replace(/\\/g, "/");
    }

    await vice_president.update({
      first_name: first_name ?? vice_president.first_name,
      last_name: last_name ?? vice_president.last_name,
      biography: biography ?? vice_president.biography,
      image_url: image_path,
    });

    res.json({
      success: 1,
      data: vice_president,
      message: "Başkan Yardımcısı bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteVicePresident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vice_president = await VicePresident.findByPk(id);
    if (!vice_president) {
      return res.status(404).json({
        success: 1,
        data: null,
        message: "Silinecek başkan yardımcısı bulunamadı.",
      });
    }
    const imageToDelete = vice_president.image_url;
    await vice_president.destroy();
    if (imageToDelete && fs.existsSync(imageToDelete)) {
      fs.unlinkSync(imageToDelete);
    }
    res.json({ success: 1, data: null, message: "Başkan yardımcısı silindi." });
  } catch (err) {
    next(err);
  }
};
