"use strict";

const { handleValidation, requireBody, requireFields } = require("./commonValidator");
const adminValidators = require("./adminValidators");
const entityValidators = require("./entityValidators");
const { searchQRequired, searchLimitQuery, adminListQuery, searchQuery } = require("./fields");
const { query } = require("express-validator");

const searchValidation = [searchQRequired, searchLimitQuery, adminListQuery, handleValidation];

const listWithSearchQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("Sayfa numarası 1 veya daha büyük olmalıdır."),
  query("per_page")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("Sayfa başına kayıt sayısı 1-500 aralığında olmalıdır."),
  searchQuery,
  adminListQuery,
  handleValidation,
];

module.exports = {
  ...adminValidators,
  ...entityValidators,
  requireBody,
  requireFields,
  searchValidation,
  listWithSearchQuery,
};
