const { body, param, query, validationResult } = require("express-validator");
const { labelField } = require("../helpers/errorLabels");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: 0,
    errors: errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
};

const idParam = (name = "id") => [
  param(name)
    .exists()
    .withMessage(`${labelField(name)} parametresi zorunludur.`)
    .bail()
    .isInt({ min: 1 })
    .withMessage(`${labelField(name)} pozitif bir sayı olmalıdır.`),
  handleValidation,
];

const paginationQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sayfa numarası 1 veya daha büyük olmalıdır."),
  query("per_page")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("Sayfa başına kayıt sayısı 1-500 aralığında olmalıdır."),
  handleValidation,
];

const requireBody = [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Geçerli bir istek gövdesi gönderilmelidir.");
    }

    const hasAnyValue = Object.values(value).some(
      (item) => item !== null && item !== undefined && String(item).trim() !== "",
    );

    if (!hasAnyValue) {
      throw new Error("İstek gövdesi en az bir dolu alan içermelidir.");
    }
    return true;
  }),
  handleValidation,
];

const requireFields = (fields = []) => [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Geçerli bir istek gövdesi gönderilmelidir.");
    }

    const missingFields = fields.filter((field) => {
      const fieldValue = value[field];
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        String(fieldValue).trim() === ""
      );
    });

    if (missingFields.length > 0) {
      throw new Error(`Zorunlu alanlar eksik: ${missingFields.map(labelField).join(", ")}`);
    }

    return true;
  }),
  handleValidation,
];

const reorderIdsBody = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("Kimlik listesi zorunludur ve en az bir öğe içermelidir."),
  body("ids.*")
    .isInt({ min: 1 })
    .withMessage("Kimlik listesindeki her değer pozitif bir sayı olmalıdır."),
  handleValidation,
];

module.exports = {
  handleValidation,
  idParam,
  paginationQuery,
  requireBody,
  requireFields,
  reorderIdsBody,
};
