const { body } = require("express-validator");
const {
  handleValidation,
  requireBody,
  requireFields,
} = require("./commonValidator");
const { PERMISSION_MODULES } = require("../helpers/adminPermissions");

const loginValidation = [
  body("email").isEmail().withMessage("Geçerli bir e-posta giriniz."),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır."),
  handleValidation,
];

const adminRegisterValidation = [
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Ad en az 2 karakter olmalıdır."),
  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Soyad en az 2 karakter olmalıdır."),
  body("email").isEmail().withMessage("Geçerli bir e-posta giriniz."),
  body("phone_number")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Telefon numarası zorunludur."),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Şifre en az 8 karakter olmalıdır."),
  body("role")
    .optional()
    .isIn(["superadmin", "admin"])
    .withMessage("role yalnızca 'superadmin' veya 'admin' olabilir."),
  body("permissions")
    .optional()
    .isObject()
    .withMessage("permissions geçerli bir JSON obje olmalıdır."),
  body("permissions.all")
    .optional()
    .isBoolean()
    .withMessage("permissions.all boolean olmalıdır."),
  body("permissions.*")
    .optional()
    .custom((modulePermission, { path }) => {
      const moduleName = path.replace("permissions.", "");
      if (moduleName === "all") return true;
      if (!PERMISSION_MODULES.includes(moduleName)) {
        throw new Error(`Geçersiz yetki modülü: ${moduleName}`);
      }
      if (typeof modulePermission !== "object" || modulePermission === null) {
        throw new Error(
          `${moduleName} yetkisi read/create/update/delete alanlarını içeren obje olmalıdır.`,
        );
      }

      const validActions = ["read", "create", "update", "delete"];
      const keys = Object.keys(modulePermission);
      const hasInvalidKey = keys.some((key) => !validActions.includes(key));
      if (hasInvalidKey) {
        throw new Error(
          `${moduleName} için yalnızca read/create/update/delete anahtarları kullanılabilir.`,
        );
      }
      const hasInvalidValue = keys.some(
        (key) => typeof modulePermission[key] !== "boolean",
      );
      if (hasInvalidValue) {
        throw new Error(`${moduleName} yetki değerleri boolean olmalıdır.`);
      }
      return true;
    }),
  handleValidation,
];

const tenderCreateValidation = [...requireFields(["title"])];

const tenderUpdateValidation = [...requireBody];

const adminUpdateValidation = [
  ...requireBody,
  body("first_name").optional().isString().trim().isLength({ min: 2 }),
  body("last_name").optional().isString().trim().isLength({ min: 2 }),
  body("email").optional().isEmail(),
  body("phone_number").optional().isString().trim().notEmpty(),
  body("password").optional().isString().isLength({ min: 8 }),
  body("role").optional().isIn(["superadmin", "admin"]),
  body("permissions").optional().isObject(),
  handleValidation,
];

module.exports = {
  loginValidation,
  adminRegisterValidation,
  adminUpdateValidation,
  tenderCreateValidation,
  tenderUpdateValidation,
  requireBody,
  requireFields,
};
