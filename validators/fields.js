"use strict";

const { body, query } = require("express-validator");
const { labelField } = require("../helpers/errorLabels");

const SPOT_MAX_LEN = 50;
const NEWS_SPOT_MAX_LEN = 500;
const RECORD_TYPES = ["public_notice", "tender", "council_decision", "real_estate_listing"];
const EVENT_TYPES = ["competition", "activity"];
const SUGGESTION_STATUSES = ["pending", "reviewed", "completed"];
const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "pazartesi",
  "salı",
  "çarşamba",
  "perşembe",
  "cuma",
  "cumartesi",
  "pazar",
];

function lbl(field) {
  return labelField(field);
}

function requiredText(field, { min = 1, max } = {}) {
  let chain = body(field)
    .trim()
    .notEmpty()
    .withMessage(`${lbl(field)} zorunludur.`);
  if (min > 1) {
    chain = chain
      .isLength({ min })
      .withMessage(`${lbl(field)} en az ${min} karakter olmalıdır.`);
  }
  if (max) {
    chain = chain
      .isLength({ max })
      .withMessage(`${lbl(field)} en fazla ${max} karakter olabilir.`);
  }
  return chain;
}

function optionalText(field, { min, max } = {}) {
  let chain = body(field).optional({ values: "falsy" }).trim();
  if (min) {
    chain = chain
      .isLength({ min })
      .withMessage(`${lbl(field)} en az ${min} karakter olmalıdır.`);
  }
  if (max) {
    chain = chain
      .isLength({ max })
      .withMessage(`${lbl(field)} en fazla ${max} karakter olabilir.`);
  }
  return chain;
}

function optionalBool(field) {
  return body(field)
    .optional({ values: "falsy" })
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      if (typeof value === "boolean") return true;
      const s = String(value).toLowerCase();
      if (["true", "false", "1", "0"].includes(s)) return true;
      throw new Error(`${lbl(field)} doğru veya yanlış olmalıdır.`);
    });
}

function optionalPositiveInt(field) {
  return body(field)
    .optional({ values: "falsy" })
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      const n = Number.parseInt(String(value), 10);
      if (!Number.isInteger(n) || n < 1) {
        throw new Error(`${lbl(field)} pozitif bir tam sayı olmalıdır.`);
      }
      return true;
    });
}

function requiredPositiveInt(field) {
  return body(field)
    .notEmpty()
    .withMessage(`${lbl(field)} zorunludur.`)
    .bail()
    .custom((value) => {
      const n = Number.parseInt(String(value), 10);
      if (!Number.isInteger(n) || n < 1) {
        throw new Error(`${lbl(field)} pozitif bir tam sayı olmalıdır.`);
      }
      return true;
    });
}

function optionalDecimal(field) {
  return body(field)
    .optional({ values: "falsy" })
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      const n = Number.parseFloat(String(value).replace(",", "."));
      if (!Number.isFinite(n)) {
        throw new Error(`${lbl(field)} geçerli bir sayı olmalıdır.`);
      }
      return true;
    });
}

function optionalDateField(field) {
  return body(field)
    .optional({ values: "falsy" })
    .trim()
    .custom((value) => {
      if (!value) return true;
      const s = String(value).trim();
      const iso = /^\d{4}-\d{2}-\d{2}$/;
      const tr = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
      if (!iso.test(s) && !tr.test(s)) {
        throw new Error(`${lbl(field)} geçerli bir tarih olmalıdır (GG.AA.YYYY veya YYYY-MM-DD).`);
      }
      return true;
    });
}

function parseJsonArray(value) {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error("Dizi formatında olmalıdır.");
    return parsed;
  }
  throw new Error("Dizi formatında olmalıdır.");
}

function jsonIntArrayField(field, { required = false } = {}) {
  const chain = body(field).custom((value) => {
    if (!required && (value === undefined || value === null || value === "")) {
      return true;
    }
    try {
      const arr = parseJsonArray(value);
      const invalid = arr.some((id) => {
        const n = Number(id);
        return !Number.isInteger(n) || n < 1;
      });
      if (invalid) {
        throw new Error(`${lbl(field)} yalnızca pozitif tam sayılardan oluşmalıdır.`);
      }
      return true;
    } catch (err) {
      throw new Error(err.message || `${lbl(field)} geçerli bir dizi olmalıdır.`);
    }
  });
  if (required) {
    return chain.notEmpty().withMessage(`${lbl(field)} zorunludur.`);
  }
  return chain.optional({ values: "falsy" });
}

function jsonArrayField(field) {
  return body(field)
    .optional({ values: "falsy" })
    .custom((value) => {
      if (value === undefined || value === null || value === "") return true;
      try {
        parseJsonArray(value);
        return true;
      } catch {
        throw new Error(`${lbl(field)} geçerli bir dizi olmalıdır.`);
      }
    });
}

const titleRequired = () => requiredText("title", { min: 2, max: 255 });
const titleOptional = () => optionalText("title", { min: 2, max: 255 });
const nameRequired = () => requiredText("name", { min: 2, max: 255 });
const nameOptional = () => optionalText("name", { min: 2, max: 255 });
const spotRequired = () => requiredText("spot", { min: 1, max: SPOT_MAX_LEN });
const spotOptional = () => optionalText("spot", { min: 1, max: SPOT_MAX_LEN });
const newsSpotRequired = () =>
  requiredText("spot", { min: 1, max: NEWS_SPOT_MAX_LEN });
const newsSpotOptional = () =>
  optionalText("spot", { min: 1, max: NEWS_SPOT_MAX_LEN });

const searchQuery = query("search")
  .optional()
  .isString()
  .trim()
  .isLength({ max: 200 })
  .withMessage("Arama metni en fazla 200 karakter olabilir.");

const adminListQuery = query("admin")
  .optional()
  .isIn(["true", "false", "1", "0"])
  .withMessage("Yönetici görünümü doğru veya yanlış olmalıdır.");

const searchQRequired = query("q")
  .trim()
  .notEmpty()
  .withMessage("Arama için sorgu parametresi zorunludur.")
  .isLength({ min: 1, max: 200 })
  .withMessage("Arama sorgusu 1-200 karakter arasında olmalıdır.");

const searchLimitQuery = query("limit")
  .optional()
  .isInt({ min: 1, max: 20 })
  .withMessage("Sonuç limiti 1-20 arasında olmalıdır.");

module.exports = {
  SPOT_MAX_LEN,
  NEWS_SPOT_MAX_LEN,
  RECORD_TYPES,
  EVENT_TYPES,
  SUGGESTION_STATUSES,
  WEEKDAYS,
  requiredText,
  optionalText,
  optionalBool,
  optionalPositiveInt,
  requiredPositiveInt,
  optionalDecimal,
  optionalDateField,
  jsonIntArrayField,
  jsonArrayField,
  titleRequired,
  titleOptional,
  nameRequired,
  nameOptional,
  spotRequired,
  spotOptional,
  newsSpotRequired,
  newsSpotOptional,
  searchQuery,
  adminListQuery,
  searchQRequired,
  searchLimitQuery,
};
