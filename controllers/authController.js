const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        username: admin.username,
        permissions: admin.permissions,
      },
      process.env.JWT_SECRET || "atakum_secret_key",
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
    const { username, email, password, permissions } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: permissions || {},
      last_login: new Date(),
    });

    res.status(201).json({
      success: 1,
      data: newAdmin,
      message: "Admin başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};
