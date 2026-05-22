const { WorkplaceLicense } = require("../models");
const {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
  syncRemovedAttachmentFiles,
} = require("../helpers/normalizeUploadFiles");

exports.getWorkplaceLicenses = async (req, res, next) => {
  try {
    const row = await WorkplaceLicense.findOne({ order: [["id", "DESC"]] });
    return res.json({
      success: 1,
      data: row || { id: null, content: "", files: [] },
      message: "İşyeri ruhsatları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.upsertWorkplaceLicenses = async (req, res, next) => {
  try {
    const { content, files } = req.body;
    let row = await WorkplaceLicense.findOne({ order: [["id", "DESC"]] });

    const prevFiles = row && Array.isArray(row.files) ? row.files : [];
    const uploaded = collectUploadedFiles(req);
    const nextFiles = normalizeFiles(prevFiles, files, uploaded);

    const patch = {
      content: content !== undefined ? content : (row?.content ?? ""),
      files: nextFiles,
    };

    if (row) {
      await row.update(patch);
      syncRemovedAttachmentFiles(prevFiles, nextFiles);
    } else {
      row = await WorkplaceLicense.create(patch);
    }

    return res.json({
      success: 1,
      data: row,
      message: "İşyeri ruhsatları kaydedildi.",
    });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};
