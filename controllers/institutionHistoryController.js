const { InstitutionHistory } = require("../models");

function parseJsonArrayField(rawValue, fallback = []) {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return fallback;
  }
  const parsed =
    typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
  if (!Array.isArray(parsed)) {
    throw new Error("Beklenen alan dizi formatında olmalı.");
  }
  return parsed;
}

exports.getInstitutionHistory = async (req, res, next) => {
  try {
    const row = await InstitutionHistory.findOne({ order: [["id", "DESC"]] });
    return res.json({
      success: 1,
      data: row || { id: null, content: "", presidents: [], timeline: [] },
      message: "Kurum tarihçesi getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.upsertInstitutionHistory = async (req, res, next) => {
  try {
    const { content, presidents, timeline } = req.body;
    let row = await InstitutionHistory.findOne({ order: [["id", "DESC"]] });

    const patch = {
      content: content !== undefined ? content : (row?.content ?? ""),
      presidents: parseJsonArrayField(presidents, row?.presidents ?? []),
      timeline: parseJsonArrayField(timeline, row?.timeline ?? []),
    };

    if (row) {
      await row.update(patch);
    } else {
      row = await InstitutionHistory.create(patch);
    }

    return res.json({
      success: 1,
      data: row,
      message: "Kurum tarihçesi kaydedildi.",
    });
  } catch (err) {
    next(err);
  }
};
