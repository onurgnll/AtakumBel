"use strict";

/**
 * Atakum birim seed verisi: müdürlükler + site personeli (atakumBirimGenerated).
 * Üretim: scripts/build-atakum-birim-seed-data.cjs → atakumBirimGenerated.js
 */
const generated = require("./atakumBirimGenerated");

const departmentsForInsert = generated.departments.map(({ id, slug, ...rest }) => ({
  name: rest.name,
  description: rest.description,
  address: rest.address,
  reports_to_president: rest.reports_to_president,
}));

const departmentNameByOldId = Object.fromEntries(
  generated.departments.map((d) => [d.id, d.name]),
);

const seededDepartmentNames = generated.departments.map((d) => d.name);

const websiteEmployeesSource = generated.websiteEmployees;

module.exports = {
  departmentsForInsert,
  websiteEmployeesSource,
  departmentNameByOldId,
  seededDepartmentNames,
};
