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
  if (req.files && Array.isArray(req.files) && req.files.length) return req.files;
  if (req.file) return [req.file];
  return [];
}

function unlinkUploadedFiles(req) {
  const fs = require("fs");
  for (const f of collectUploadedFiles(req)) {
    if (f?.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
  }
}

module.exports = {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
};
