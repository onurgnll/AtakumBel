"use strict";

const { body } = require("express-validator");
const { handleValidation, requireBody } = require("./commonValidator");
const {
  RECORD_TYPES,
  EVENT_TYPES,
  SUGGESTION_STATUSES,
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
} = require("./fields");

// ─── Birimler ───────────────────────────────────────────────────────────────

const departmentCreateValidation = [
  nameRequired(),
  requiredText("description", { min: 1 }),
  requiredText("address", { min: 1 }),
  optionalPositiveInt("manager_employee_id"),
  optionalBool("reports_to_president"),
  handleValidation,
];

const departmentUpdateValidation = [
  ...requireBody,
  nameOptional(),
  optionalText("description", { min: 1 }),
  optionalText("address", { min: 1 }),
  optionalPositiveInt("manager_employee_id"),
  optionalBool("reports_to_president"),
  handleValidation,
];

// ─── Çalışanlar ─────────────────────────────────────────────────────────────

const employeeCreateValidation = [
  requiredText("first_name", { min: 2, max: 100 }),
  requiredText("last_name", { min: 2, max: 100 }),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Ünvan zorunludur.")
    .isLength({ min: 1, max: 150 })
    .withMessage("Ünvan en fazla 150 karakter olabilir."),
  requiredPositiveInt("department_id"),
  requiredText("dahili_no", { min: 1, max: 20 }),
  optionalBool("is_unit_manager"),
  optionalBool("is_contact_person"),
  optionalBool("is_active"),
  handleValidation,
];

const employeeUpdateValidation = [
  ...requireBody,
  optionalText("first_name", { min: 2, max: 100 }),
  optionalText("last_name", { min: 2, max: 100 }),
  body("title")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Ünvan en fazla 150 karakter olabilir."),
  optionalPositiveInt("department_id"),
  optionalText("dahili_no", { min: 1, max: 20 }),
  optionalBool("is_unit_manager"),
  optionalBool("is_contact_person"),
  optionalBool("is_active"),
  handleValidation,
];

// ─── Haber / Basın bülteni ──────────────────────────────────────────────────

const newsCreateValidation = [
  titleRequired(),
  spotRequired(),
  requiredText("content", { min: 1 }),
  optionalBool("is_active"),
  handleValidation,
];

const newsUpdateValidation = [
  ...requireBody,
  titleOptional(),
  spotOptional(),
  optionalText("content", { min: 1 }),
  optionalBool("is_active"),
  handleValidation,
];

const pressReleaseCreateValidation = [...newsCreateValidation];
const pressReleaseUpdateValidation = [...newsUpdateValidation];

// ─── Etkinlikler ────────────────────────────────────────────────────────────

const eventCreateValidation = [
  titleRequired(),
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Etkinlik türü zorunludur.")
    .isIn(EVENT_TYPES)
    .withMessage("Etkinlik türü yarışma veya aktivite olmalıdır."),
  requiredText("start_date", { min: 1 }),
  requiredText("end_date", { min: 1 }),
  requiredText("event_time", { min: 1, max: 50 }),
  requiredText("address", { min: 1, max: 500 }),
  requiredText("description", { min: 1 }),
  handleValidation,
];

const eventUpdateValidation = [
  ...requireBody,
  titleOptional(),
  body("type")
    .optional({ values: "falsy" })
    .trim()
    .isIn(EVENT_TYPES)
    .withMessage("Etkinlik türü yarışma veya aktivite olmalıdır."),
  optionalText("start_date", { min: 1 }),
  optionalText("end_date", { min: 1 }),
  optionalText("event_time", { min: 1, max: 50 }),
  optionalText("address", { min: 1, max: 500 }),
  optionalText("description", { min: 1 }),
  handleValidation,
];

// ─── Hizmet / Proje ─────────────────────────────────────────────────────────

const serviceCreateValidation = [
  nameRequired(),
  requiredText("content", { min: 1 }),
  handleValidation,
];

const serviceUpdateValidation = [
  ...requireBody,
  nameOptional(),
  optionalText("content", { min: 1 }),
  handleValidation,
];

const projectCreateValidation = [
  nameRequired(),
  optionalText("content", { min: 1 }),
  handleValidation,
];

const projectUpdateValidation = [
  ...requireBody,
  nameOptional(),
  optionalText("content", { min: 1 }),
  handleValidation,
];

// ─── Tesisler ───────────────────────────────────────────────────────────────

const facilityCreateValidation = [
  nameRequired(),
  requiredText("address", { min: 1, max: 500 }),
  optionalText("description", { min: 1 }),
  optionalDecimal("latitude"),
  optionalDecimal("longitude"),
  handleValidation,
];

const facilityUpdateValidation = [
  ...requireBody,
  nameOptional(),
  optionalText("address", { min: 1, max: 500 }),
  optionalText("description", { min: 1 }),
  optionalDecimal("latitude"),
  optionalDecimal("longitude"),
  handleValidation,
];

// ─── Genelgeler ─────────────────────────────────────────────────────────────

const directiveCreateValidation = [
  titleRequired(),
  requiredText("description", { min: 1 }),
  handleValidation,
];

const directiveUpdateValidation = [
  titleRequired(),
  requiredText("description", { min: 1 }),
  optionalDateField("publish_date"),
  handleValidation,
];

// ─── Başkan yardımcıları ────────────────────────────────────────────────────

const vicePresidentCreateValidation = [
  requiredText("first_name", { min: 2, max: 100 }),
  requiredText("last_name", { min: 2, max: 100 }),
  requiredText("biography", { min: 1 }),
  jsonIntArrayField("department_ids"),
  optionalPositiveInt("department_id"),
  handleValidation,
];

const vicePresidentUpdateValidation = [
  ...requireBody,
  optionalText("first_name", { min: 2, max: 100 }),
  optionalText("last_name", { min: 2, max: 100 }),
  optionalText("biography", { min: 1 }),
  jsonIntArrayField("department_ids"),
  optionalPositiveInt("department_id"),
  handleValidation,
];

// ─── Meclis üyeleri ─────────────────────────────────────────────────────────

const councilMemberCreateValidation = [
  requiredText("first_name", { min: 2, max: 100 }),
  requiredText("last_name", { min: 2, max: 100 }),
  requiredText("political_party", { min: 1, max: 150 }),
  handleValidation,
];

const councilMemberUpdateValidation = [
  ...requireBody,
  optionalText("first_name", { min: 2, max: 100 }),
  optionalText("last_name", { min: 2, max: 100 }),
  optionalText("political_party", { min: 1, max: 150 }),
  handleValidation,
];

// ─── Proje önerileri ────────────────────────────────────────────────────────

const suggestionCreateValidation = [
  requiredText("project_name", { min: 2, max: 255 }),
  requiredText("project_purpose", { min: 1 }),
  requiredText("application_duration", { min: 1, max: 100 }),
  requiredText("total_budget", { min: 1, max: 100 }),
  requiredText("location", { min: 1, max: 255 }),
  requiredText("stakeholders", { min: 1 }),
  requiredText("beneficiaries", { min: 1 }),
  requiredText("main_activities", { min: 1 }),
  requiredText("expected_results", { min: 1 }),
  handleValidation,
];

const suggestionStatusUpdateValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Durum zorunludur.")
    .isIn(SUGGESTION_STATUSES)
    .withMessage("Geçersiz durum. Geçerli değerler: beklemede, incelendi, tamamlandı"),
  handleValidation,
];

// ─── Açılır pencere ─────────────────────────────────────────────────────────

const contentPopupCreateValidation = [
  optionalText("title", { max: 255 }),
  optionalText("description", { min: 1 }),
  optionalDateField("starts_at"),
  optionalDateField("ends_at"),
  optionalText("redirect_url", { max: 500 }),
  optionalBool("is_active"),
  handleValidation,
];

const contentPopupUpdateValidation = [
  ...requireBody,
  optionalText("title", { max: 255 }),
  optionalText("description", { min: 1 }),
  optionalDateField("starts_at"),
  optionalDateField("ends_at"),
  optionalText("redirect_url", { max: 500 }),
  optionalBool("is_active"),
  body("clear_image")
    .optional({ values: "falsy" })
    .isIn(["1", "0", "true", "false"])
    .withMessage("Görsel temizleme alanı geçersiz."),
  handleValidation,
];

// ─── Harita noktaları ───────────────────────────────────────────────────────

const mapPointCreateValidation = [
  nameRequired(),
  requiredText("latitude", { min: 1 }),
  requiredText("longitude", { min: 1 }),
  handleValidation,
];

const mapPointUpdateValidation = [
  ...requireBody,
  nameOptional(),
  optionalText("latitude", { min: 1 }),
  optionalText("longitude", { min: 1 }),
  handleValidation,
];

const marketplaceCreateValidation = [
  nameRequired(),
  requiredText("latitude", { min: 1 }),
  requiredText("longitude", { min: 1 }),
  requiredText("day_of_week", { min: 1, max: 20 }),
  handleValidation,
];

const marketplaceUpdateValidation = [
  ...requireBody,
  nameOptional(),
  optionalText("latitude", { min: 1 }),
  optionalText("longitude", { min: 1 }),
  optionalText("day_of_week", { min: 1, max: 20 }),
  handleValidation,
];

// ─── Başkan ─────────────────────────────────────────────────────────────────

const presidentUpsertValidation = [
  optionalText("first_name", { min: 2, max: 100 }),
  optionalText("last_name", { min: 2, max: 100 }),
  optionalText("biography", { min: 1 }),
  optionalText("message", { min: 1 }),
  optionalText("birth_place", { max: 150 }),
  optionalText("birth_year", { max: 10 }),
  optionalText("grown_place", { max: 150 }),
  optionalText("marital_status", { max: 50 }),
  jsonIntArrayField("president_department_ids"),
  jsonArrayField("social_media_accounts"),
  jsonArrayField("education"),
  jsonArrayField("political_career"),
  jsonArrayField("work_life"),
  handleValidation,
];

// ─── Kurum tarihçesi / işyeri ruhsatı ───────────────────────────────────────

const institutionHistoryUpsertValidation = [
  optionalText("content", { min: 1 }),
  jsonArrayField("presidents"),
  jsonArrayField("timeline"),
  handleValidation,
];

const workplaceLicenseUpsertValidation = [
  optionalText("content", { min: 1 }),
  handleValidation,
];

// ─── Yayınlar ─────────────────────────────────────────────────────────────────

const publicationCreateValidation = [
  titleRequired(),
  body("record_type")
    .trim()
    .notEmpty()
    .withMessage("Kayıt türü zorunludur.")
    .isIn(RECORD_TYPES)
    .withMessage("Geçersiz kayıt türü."),
  optionalText("description", { min: 1 }),
  optionalBool("is_active"),
  optionalDateField("start_date"),
  optionalDateField("end_date"),
  optionalDateField("date"),
  optionalPositiveInt("department_id"),
  optionalText("tender_number", { max: 100 }),
  optionalText("decision_no", { max: 100 }),
  optionalText("summary", { min: 1 }),
  optionalText("full_text", { min: 1 }),
  optionalText("content", { min: 1 }),
  handleValidation,
];

const publicationUpdateValidation = [
  ...requireBody,
  titleOptional(),
  optionalText("description", { min: 1 }),
  optionalBool("is_active"),
  optionalDateField("start_date"),
  optionalDateField("end_date"),
  optionalDateField("date"),
  optionalPositiveInt("department_id"),
  optionalText("tender_number", { max: 100 }),
  optionalText("decision_no", { max: 100 }),
  optionalText("summary", { min: 1 }),
  optionalText("full_text", { min: 1 }),
  optionalText("content", { min: 1 }),
  handleValidation,
];

// ─── Belge kategorileri (ortak fabrika) ─────────────────────────────────────

function buildDocumentCategoryCreateValidation({ foreignKeyRequired = false } = {}) {
  const rules = [
    titleRequired(),
    optionalText("description", { min: 1 }),
    optionalDateField("publish_date"),
    optionalBool("is_active"),
    optionalText("link", { max: 500 }),
  ];
  if (foreignKeyRequired) {
    rules.push(requiredPositiveInt("department_id"));
  } else {
    rules.push(optionalPositiveInt("department_id"));
  }
  rules.push(handleValidation);
  return rules;
}

function buildDocumentCategoryUpdateValidation({ foreignKeyRequired = false } = {}) {
  const rules = [
    ...requireBody,
    titleOptional(),
    optionalText("description", { min: 1 }),
    optionalDateField("publish_date"),
    optionalBool("is_active"),
    optionalText("link", { max: 500 }),
  ];
  if (foreignKeyRequired) {
    rules.push(optionalPositiveInt("department_id"));
  }
  rules.push(handleValidation);
  return rules;
}

const documentCategoryCreateValidation = buildDocumentCategoryCreateValidation();
const documentCategoryUpdateValidation = buildDocumentCategoryUpdateValidation();
const departmentDocumentCreateValidation = buildDocumentCategoryCreateValidation({
  foreignKeyRequired: true,
});
const departmentDocumentUpdateValidation = buildDocumentCategoryUpdateValidation({
  foreignKeyRequired: true,
});

module.exports = {
  departmentCreateValidation,
  departmentUpdateValidation,
  employeeCreateValidation,
  employeeUpdateValidation,
  newsCreateValidation,
  newsUpdateValidation,
  pressReleaseCreateValidation,
  pressReleaseUpdateValidation,
  eventCreateValidation,
  eventUpdateValidation,
  serviceCreateValidation,
  serviceUpdateValidation,
  projectCreateValidation,
  projectUpdateValidation,
  facilityCreateValidation,
  facilityUpdateValidation,
  directiveCreateValidation,
  directiveUpdateValidation,
  vicePresidentCreateValidation,
  vicePresidentUpdateValidation,
  councilMemberCreateValidation,
  councilMemberUpdateValidation,
  suggestionCreateValidation,
  suggestionStatusUpdateValidation,
  contentPopupCreateValidation,
  contentPopupUpdateValidation,
  mapPointCreateValidation,
  mapPointUpdateValidation,
  marketplaceCreateValidation,
  marketplaceUpdateValidation,
  presidentUpsertValidation,
  institutionHistoryUpsertValidation,
  workplaceLicenseUpsertValidation,
  publicationCreateValidation,
  publicationUpdateValidation,
  documentCategoryCreateValidation,
  documentCategoryUpdateValidation,
  departmentDocumentCreateValidation,
  departmentDocumentUpdateValidation,
  buildDocumentCategoryCreateValidation,
  buildDocumentCategoryUpdateValidation,
};
