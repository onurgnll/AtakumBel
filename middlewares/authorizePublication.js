"use strict";

const { Publication } = require("../models");
const { authorize } = require("./authMiddleware");
const {
  isValidRecordType,
  permissionModuleForRecordType,
} = require("../helpers/publicationPermissions");

async function resolveRecordType(req) {
  const fromBody = req.body?.record_type;
  if (fromBody && String(fromBody).trim()) return String(fromBody).trim();

  const fromQuery = req.query?.record_type;
  if (fromQuery && String(fromQuery).trim()) {
    return String(fromQuery).split(",")[0].trim();
  }

  if (req.params?.id) {
    const row = await Publication.findByPk(req.params.id, {
      attributes: ["record_type"],
    });
    if (!row) {
      const err = new Error("Yayın bulunamadı.");
      err.status = 404;
      throw err;
    }
    return row.record_type;
  }

  return null;
}

/** record_type → ilgili modül izni (publicNotices, tenders, …) */
const authorizePublication = async (req, res, next) => {
  try {
    const recordType = await resolveRecordType(req);
    if (!recordType) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "record_type zorunludur.",
      });
    }
    if (!isValidRecordType(recordType)) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: `Geçersiz record_type: ${recordType}`,
      });
    }

    const moduleName = permissionModuleForRecordType(recordType);
    return authorize(moduleName)(req, res, next);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ success: 0, data: null, message: err.message });
    }
    return next(err);
  }
};

module.exports = { authorizePublication };
