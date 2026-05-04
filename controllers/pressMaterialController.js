const { PressMaterial } = require("../models");
const fs = require("fs");

// Read
exports.getAllPressMaterials = async (req, res, next) => {
  try {
    const materials = await PressMaterial.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      success: 1,
      data: materials,
      message: "Basın materyalleri başarıyla listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Create
exports.createPressMaterial = async (req, res, next) => {
  try {
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    if (!uploadedFile) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Lütfen yüklenecek bir dosya seçin. (Key ismini kontrol edin)",
      });
    }

    const file_path = uploadedFile.path.replace(/\\/g, "/");

    const newMaterial = await PressMaterial.create({
      file_url: file_path,
    });

    res.status(201).json({
      success: 1,
      data: newMaterial,
      message: "Basın materyali başarıyla yüklendi.",
    });
  } catch (err) {
    const fileToClean =
      req.file || (req.files && Object.values(req.files).flat()[0]);
    if (fileToClean && fs.existsSync(fileToClean.path)) {
      fs.unlinkSync(fileToClean.path);
    }
    next(err);
  }
};
//Update
exports.updatePressMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await PressMaterial.findByPk(id);

    if (!material) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Basın Materyali bulunamadı.",
      });
    }

    let file_path = material.file_url;

    if (req.file) {
      if (material.file_url && fs.existsSync(material.file_url)) {
        fs.unlinkSync(material.file_url);
      }
    }

    file_path = req.file.path.replace(/\\/g, "/");

    await material.update({ file_url: file_path });

    res.json({
      success: 1,
      data: material,
      message: "Basın materyali başarıyla güncellendi.",
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

// Delete
exports.deletePressMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await PressMaterial.findByPk(id);

    if (!material) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek materyal bulunamadı.",
      });
    }

    const fileToDelete = material.file_url;

    await material.destroy();

    if (material.file_url && fs.existsSync(material.file_url)) {
      fs.unlinkSync(material.file_url);
    }

    res.json({
      success: 1,
      data: null,
      message: "Basın materyali ve dosyası başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
