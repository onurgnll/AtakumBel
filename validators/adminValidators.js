"use strict";

const { body } = require("express-validator");
const { handleValidation, requireBody } = require("./commonValidator");
const { PERMISSION_MODULES } = require("../helpers/adminPermissions");
const { labelModule } = require("../helpers/errorLabels");

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi giriniz.")
    .normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır."),
  handleValidation,
];

const totpCodeBody = body("code")
  .trim()
  .matches(/^\d{6}$/)
  .withMessage("Doğrulama kodu 6 haneli olmalıdır.");

const completeTotpSetupValidation = [
  body("setupToken")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Kurulum belirteci zorunludur."),
  totpCodeBody,
  handleValidation,
];

const verifyLoginTotpValidation = [
  body("challengeToken")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Doğrulama belirteci zorunludur."),
  totpCodeBody,
  handleValidation,
];

const permissionsValidator = body("permissions")
  .optional()
  .isObject()
  .withMessage("Yetkiler geçerli bir nesne biçiminde olmalıdır.")
  .bail()
  .custom((permissions) => {
    if (!permissions || typeof permissions !== "object") return true;
    if (permissions.all !== undefined && typeof permissions.all !== "boolean") {
      throw new Error("Tüm yetkiler alanı doğru veya yanlış olmalıdır.");
    }
    const validActions = ["read", "create", "update", "delete"];
    for (const [moduleName, modulePermission] of Object.entries(permissions)) {
      if (moduleName === "all") continue;
      if (!PERMISSION_MODULES.includes(moduleName)) {
        throw new Error(`Geçersiz yetki modülü: ${labelModule(moduleName)}`);
      }
      if (typeof modulePermission !== "object" || modulePermission === null) {
        throw new Error(
          `${labelModule(moduleName)} yetkisi okuma, oluşturma, güncelleme ve silme alanlarını içeren bir nesne olmalıdır.`,
        );
      }
      const keys = Object.keys(modulePermission);
      if (keys.some((key) => !validActions.includes(key))) {
        throw new Error(
          `${labelModule(moduleName)} için yalnızca okuma, oluşturma, güncelleme ve silme anahtarları kullanılabilir.`,
        );
      }
      if (keys.some((key) => typeof modulePermission[key] !== "boolean")) {
        throw new Error(`${labelModule(moduleName)} yetki değerleri doğru veya yanlış olmalıdır.`);
      }
    }
    return true;
  });

const adminRegisterValidation = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Ad zorunludur.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Ad 2-100 karakter arasında olmalıdır."),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Soyad zorunludur.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Soyad 2-100 karakter arasında olmalıdır."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi giriniz.")
    .normalizeEmail(),
  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Telefon numarası zorunludur.")
    .isLength({ min: 10, max: 20 })
    .withMessage("Telefon numarası 10-20 karakter arasında olmalıdır."),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Şifre en az 8 karakter olmalıdır.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage("Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir."),
  body("role")
    .optional()
    .isIn(["superadmin", "admin"])
    .withMessage("Rol yalnızca üst yönetici veya yönetici olabilir."),
  permissionsValidator,
  handleValidation,
];

const adminUpdateValidation = [
  ...requireBody,
  body("first_name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Ad 2-100 karakter arasında olmalıdır."),
  body("last_name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Soyad 2-100 karakter arasında olmalıdır."),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi giriniz.")
    .normalizeEmail(),
  body("phone_number")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("Telefon numarası boş olamaz.")
    .isLength({ min: 10, max: 20 })
    .withMessage("Telefon numarası 10-20 karakter arasında olmalıdır."),
  body("password")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ min: 8 })
    .withMessage("Şifre en az 8 karakter olmalıdır.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage("Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir."),
  body("role")
    .optional({ values: "falsy" })
    .isIn(["superadmin", "admin"])
    .withMessage("Rol yalnızca üst yönetici veya yönetici olabilir."),
  permissionsValidator,
  handleValidation,
];

module.exports = {
  loginValidation,
  completeTotpSetupValidation,
  verifyLoginTotpValidation,
  adminRegisterValidation,
  adminUpdateValidation,
};
