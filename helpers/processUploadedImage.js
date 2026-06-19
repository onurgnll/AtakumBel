"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;
const PNG_COMPRESSION = 9;

function isOptimizableImage(file) {
  return Boolean(file?.path && IMAGE_MIME_TYPES.has(file.mimetype));
}

async function processUploadedImage(file) {
  if (!isOptimizableImage(file)) return file;

  const filePath = file.path;
  if (!fs.existsSync(filePath)) return file;

  const meta = await sharp(filePath, { failOn: "none" }).metadata();
  if (!meta.width || !meta.height) return file;

  let pipeline = sharp(filePath, { failOn: "none" });
  if (meta.width > MAX_DIMENSION || meta.height > MAX_DIMENSION) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const tempPath = `${filePath}.opt${path.extname(filePath)}`;
  const mimetype = file.mimetype.toLowerCase();

  if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
    await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tempPath);
  } else if (mimetype === "image/png") {
    await pipeline
      .png({ compressionLevel: PNG_COMPRESSION, adaptiveFiltering: true })
      .toFile(tempPath);
  } else if (mimetype === "image/webp") {
    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(tempPath);
  } else {
    return file;
  }

  fs.renameSync(tempPath, filePath);
  const stats = fs.statSync(filePath);
  file.size = stats.size;
  return file;
}

function collectMulterFiles(req) {
  const files = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === "object") {
    for (const group of Object.values(req.files)) {
      if (Array.isArray(group)) files.push(...group);
    }
  }
  return files;
}

async function processUploadedImages(req) {
  const files = collectMulterFiles(req);
  await Promise.all(files.map((file) => processUploadedImage(file)));
}

module.exports = {
  processUploadedImage,
  processUploadedImages,
  isOptimizableImage,
};
