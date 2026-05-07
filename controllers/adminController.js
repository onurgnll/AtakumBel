const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { normalizePermissions } = require("../helpers/adminPermissions");

//Read
exports.getAllAdmins = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone_number: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const admins = await Admin.findAll({
      where: whereCondition,
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
    const { first_name, last_name, email, phone_number, permissions, password, role } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ success: 0, message: "Admin bulunamadı." });
    }

    const updateData = {
      first_name: first_name ?? admin.first_name,
      last_name: last_name ?? admin.last_name,
      email: email ?? admin.email,
      phone_number: phone_number ?? admin.phone_number,
      role: role ?? admin.role,
      permissions:
        permissions !== undefined
          ? normalizePermissions(permissions)
          : normalizePermissions(admin.permissions),
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await admin.update(updateData);
    const updatedAdmin = admin.toJSON();
    delete updatedAdmin.password;

    res.json({
      success: 1,
      data: updatedAdmin,
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
