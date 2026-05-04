const { body, validationResult } = require("express-validator");

const adminValidationRules = [
  // Username: Sadece harf, rakam ve alt çizgiye izin ver (Regex örneği)
  body("username")
    .trim()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.")
    .isLength({ min: 3 })
    .withMessage("Kullanıcı adı en az 3 karakter olmalıdır."),

  body("email")
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi giriniz.")
    .normalizeEmail(),

  // Password: En az 8 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam zorunlu
  body("password")
    .isLength({ min: 8 })
    .withMessage("Şifre en az 8 karakter olmalıdır.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .withMessage(
      "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
    ),

  // Permissions: JSON objesi kontrolü
  body("permissions")
    .isObject()
    .withMessage("Yetki alanı geçerli bir JSON objesi olmalıdır."),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: 0,
    // Hataları daha okunaklı bir formatta döndürelim
    errors: errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
};

module.exports = {
  adminValidationRules,
  validate,
};
