const { body, param, query, validationResult } = require("express-validator");

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
    .withMessage(`${name} parametresi zorunludur.`)
    .bail()
    .isInt({ min: 1 })
    .withMessage(`${name} pozitif bir sayı olmalıdır.`),
  handleValidation,
];

const paginationQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page değeri 1 veya daha büyük bir sayı olmalıdır."),
  query("per_page")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("per_page değeri 1-100 aralığında olmalıdır."),
  handleValidation,
];

const requireBody = [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Geçerli bir request body gönderilmelidir.");
    }

    const hasAnyValue = Object.values(value).some(
      (item) => item !== null && item !== undefined && String(item).trim() !== "",
    );

    if (!hasAnyValue) {
      throw new Error("Request body en az bir dolu alan içermelidir.");
    }
    return true;
  }),
  handleValidation,
];

const requireFields = (fields = []) => [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Geçerli bir request body gönderilmelidir.");
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
      throw new Error(`Zorunlu alanlar eksik: ${missingFields.join(", ")}`);
    }

    return true;
  }),
  handleValidation,
];

module.exports = {
  handleValidation,
  idParam,
  paginationQuery,
  requireBody,
  requireFields,
};
