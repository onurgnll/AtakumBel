const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { normalizePermissions } = require("../helpers/adminPermissions");

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res
        .status(401)
        .json({ success: 0, message: "E-posta veya şifre hatalı!" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role,
        permissions: normalizePermissions(admin.permissions),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    await admin.update({ last_login: new Date() });

    res.json({ success: 1, token, message: "Giriş başarılı." });
  } catch (err) {
    next(err);
  }
};

// Kayıt Et (Register)
// Sadece mevcut adminlerin erişebileceği bir fonksiyon
exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone_number, permissions, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      first_name,
      last_name,
      email,
      phone_number,
      role: role || "admin",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: normalizePermissions(permissions),
      last_login: new Date(),
    });

    const adminData = newAdmin.toJSON();
    delete adminData.password;

    res.status(201).json({
      success: 1,
      data: adminData,
      message: "Admin başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};
