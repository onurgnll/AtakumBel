/**
 * Build the final `files` path list for tenders / council decisions / real estate.
 * When `bodyFiles` is present (JSON array from admin), it is the retained server paths
 * (replacement), not merged into existing — so removals persist.
 * New multipart uploads are appended after.
 *
 * @param {unknown} existingFiles
 * @param {unknown} bodyFiles - req.body.files
 * @param {import('multer').File[] | import('multer').File | undefined} uploaded
 * @returns {string[]}
 */
function toPublicUploadPath(file) {
  if (!file || !file.path) return null;
  return file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
}

function parseRetainedBodyFiles(bodyFiles) {
  if (bodyFiles === undefined || bodyFiles === null) return undefined;
  if (Array.isArray(bodyFiles)) return [...bodyFiles];
  if (typeof bodyFiles === "string") {
    const t = bodyFiles.trim();
    if (t === "") return undefined;
    try {
      const parsed = JSON.parse(bodyFiles);
      if (Array.isArray(parsed)) return [...parsed];
      return bodyFiles ? [bodyFiles] : [];
    } catch {
      return bodyFiles ? [bodyFiles] : [];
    }
  }
  return [];
}

function normalizeFiles(existingFiles, bodyFiles, uploaded) {
  const uploads = Array.isArray(uploaded)
    ? uploaded
    : uploaded
      ? [uploaded]
      : [];

  const retained = parseRetainedBodyFiles(bodyFiles);
  const files =
    retained === undefined
      ? Array.isArray(existingFiles)
        ? [...existingFiles]
        : []
      : [...retained];

  for (const u of uploads) {
    const p = toPublicUploadPath(u);
    if (p) files.push(p);
  }
  return files;
}

function collectUploadedFiles(req) {
  if (req.files) {
    if (Array.isArray(req.files) && req.files.length) return req.files;
    const list = [];
    const bucket = req.files;
    for (const key of ["files", "file", "document"]) {
      if (!bucket[key]) continue;
      const chunk = bucket[key];
      if (Array.isArray(chunk)) list.push(...chunk);
      else list.push(chunk);
    }
    if (list.length) return list;
  }
  if (req.file) return [req.file];
  return [];
}

function unlinkUploadedFiles(req) {
  const fs = require("fs");
  for (const f of collectUploadedFiles(req)) {
    if (f?.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
  }
  for (const f of collectGalleryImages(req)) {
    if (f?.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
  }
}

/** Multipart `images` alanı (galeri görselleri) */
function collectGalleryImages(req) {
  if (!req.files) return [];
  if (Array.isArray(req.files)) return req.files;
  const imgs = req.files.images;
  if (!imgs) return [];
  return Array.isArray(imgs) ? imgs : [imgs];
}

function deleteStoredFilePaths(paths) {
  const fs = require("fs");
  const path = require("path");
  if (!Array.isArray(paths)) return;
  for (const rawPath of paths) {
    if (!rawPath || typeof rawPath !== "string") continue;
    const normalized = rawPath.replace(/\\/g, "/");
    const relative = normalized.startsWith("/uploads/")
      ? `public${normalized}`
      : normalized.replace(/^\/+/, "");
    const absPath = path.resolve(process.cwd(), relative);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  }
}

function syncRemovedAttachmentFiles(previousFiles, nextFiles) {
  const prev = Array.isArray(previousFiles) ? previousFiles : [];
  const next = Array.isArray(nextFiles) ? nextFiles : [];
  const removed = prev.filter((p) => !next.includes(p));
  deleteStoredFilePaths(removed);
}

module.exports = {
  normalizeFiles,
  collectUploadedFiles,
  collectGalleryImages,
  unlinkUploadedFiles,
  deleteStoredFilePaths,
  syncRemovedAttachmentFiles,
};
