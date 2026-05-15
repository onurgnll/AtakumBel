"use strict";

const RECORD_TYPES = Object.freeze([
  "public_notice",
  "tender",
  "council_decision",
  "real_estate_listing",
]);

const RECORD_TYPE_TO_MODULE = Object.freeze({
  public_notice: "publicNotices",
  tender: "tenders",
  council_decision: "councilDecisions",
  real_estate_listing: "realEstateListings",
});

function permissionModuleForRecordType(recordType) {
  return RECORD_TYPE_TO_MODULE[recordType] || null;
}

function isValidRecordType(recordType) {
  return RECORD_TYPES.includes(recordType);
}

module.exports = {
  RECORD_TYPES,
  RECORD_TYPE_TO_MODULE,
  permissionModuleForRecordType,
  isValidRecordType,
};
