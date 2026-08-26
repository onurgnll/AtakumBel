"use strict";

const fs = require("fs");
const path = require("path");

function toUploadPath(file) {
  if (!file?.path) return null;
  return file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
}

function unlinkIfExists(filePath) {
  if (!filePath || typeof filePath !== "string") return;
  const normalized = filePath.replace(/\\/g, "/").replace(/^\//, "");
  const candidates = [
    path.join("public", normalized),
    filePath,
    path.join(process.cwd(), "public", normalized),
  ];
  for (const diskPath of candidates) {
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (_) {
        /* ignore missing or locked files */
      }
      return;
    }
  }
}

function isClearImageFlag(value) {
  if (value === true || value === 1) return true;
  if (typeof value !== "string") return false;
  const v = value.toLowerCase();
  return v === "1" || v === "true";
}

function nextImageUrl(currentUrl, file, clearImage) {
  if (file) {
    if (currentUrl) unlinkIfExists(currentUrl);
    return toUploadPath(file);
  }
  if (isClearImageFlag(clearImage)) {
    if (currentUrl) unlinkIfExists(currentUrl);
    return null;
  }
  return currentUrl ?? null;
}

module.exports = {
  toUploadPath,
  unlinkIfExists,
  isClearImageFlag,
  nextImageUrl,
};
