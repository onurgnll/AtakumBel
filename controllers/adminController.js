const { Admin } = require("../models");
const bcrypt = require("bcrypt");

//Read
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]],
    });

    res.json({
      success: 1,
      data: admins,
      message: "Admin listesi başarıyla getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, permissions, password } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ success: 0, message: "Admin bulunamadı." });
    }

    const updateData = { username, email, permissions };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await admin.update(updateData);

    res.json({
      success: 1,
      data: updateData,
      message: "Admin bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ success: 0, message: "Admin bulunamadı." });
    }

    await admin.destroy();
    res.json({
      success: 1,
      data: null,
      message: "Admin hesabı kalıcı olarak silindi.",
    });
  } catch (err) {
    next(err);
  }
};
