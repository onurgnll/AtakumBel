"use strict";

const CRUD_ACTIONS = ["read", "create", "update", "delete"];

const PERMISSION_MODULES = [
  "admins",
  "departments",
  "services",
  "employees",
  "presidents",
  "vicePresidents",
  "councilMembers",
  "councilDecisions",
  "publicNotices",
  "tenders",
  "realEstateListings",
  "news",
  "events",
  "facilities",
  "suggestions",
  "directives",
  "pressMaterials",
  "photoGallery",
  "activityReports",
  "financialExpectationReports",
  "performancePrograms",
  "auditReports",
  "strategicPlans",
  "kvkkDocuments",
  "adminAuditLogs",
  "contentPopups",
];

const createCrudPermissions = (value = false) => ({
  read: value,
  create: value,
  update: value,
  delete: value,
});

const getDefaultPermissions = () => {
  const defaults = { all: false };
  PERMISSION_MODULES.forEach((moduleName) => {
    defaults[moduleName] = createCrudPermissions(false);
  });
  return defaults;
};

const normalizeModulePermissions = (moduleValue) => {
  if (moduleValue === true || moduleValue === "write") {
    return createCrudPermissions(true);
  }
  if (moduleValue === "read") {
    return { ...createCrudPermissions(false), read: true };
  }
  if (moduleValue && typeof moduleValue === "object") {
    const normalized = createCrudPermissions(false);
    CRUD_ACTIONS.forEach((action) => {
      normalized[action] = Boolean(moduleValue[action]);
    });
    return normalized;
  }
  return createCrudPermissions(false);
};

const normalizePermissions = (permissions) => {
  const normalized = getDefaultPermissions();
  if (!permissions || typeof permissions !== "object") {
    return normalized;
  }

  normalized.all = permissions.all === true;
  PERMISSION_MODULES.forEach((moduleName) => {
    normalized[moduleName] = normalizeModulePermissions(permissions[moduleName]);
  });

  return normalized;
};

module.exports = {
  CRUD_ACTIONS,
  PERMISSION_MODULES,
  getDefaultPermissions,
  normalizePermissions,
};
