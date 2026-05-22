const { Publication, Department } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { sortDateLiteral, pickSortDate } = require("../helpers/publicationSortDate");
const { isValidRecordType, RECORD_TYPES } = require("../helpers/publicationPermissions");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
  deleteStoredFilePaths,
} = require("../helpers/normalizeUploadFiles");

function dateOnly(v) {
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim().slice(0, 10);
}

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

function coerceBool(v, defaultVal = true) {
  if (v === undefined || v === null || v === "") return defaultVal;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return defaultVal;
}

function parseOptionalInt(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

function normalizeTenderNumber(v) {
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim();
}

function parseRecordTypeFilter(raw) {
  if (!raw || String(raw).trim() === "") return null;
  const types = String(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const invalid = types.filter((t) => !isValidRecordType(t));
  if (invalid.length) {
    const err = new Error(
      `Geçersiz record_type: ${invalid.join(", ")}. İzin verilenler: ${RECORD_TYPES.join(", ")}`,
    );
    err.status = 400;
    throw err;
  }
  return types;
}

function parseIsActiveFilter(raw) {
  if (raw === undefined || raw === null || raw === "") return undefined;
  const s = String(raw).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return undefined;
}

function mapPublicationRow(row) {
  const plain = row.get ? row.get({ plain: true }) : row;
  const sort_date =
    plain.sort_date != null
      ? String(plain.sort_date).slice(0, 10)
      : pickSortDate(plain);
  return { ...plain, sort_date };
}

function buildCreatePayload(recordType, body, uploaded) {
  const {
    title,
    description,
    content,
    is_active,
    files,
    start_date,
    end_date,
    department_id,
    tender_number,
    decision_no,
    date,
    summary,
    full_text,
  } = body;

  const base = {
    record_type: recordType,
    title,
    description: description || null,
    publish_date: todayDateOnly(),
    is_active: coerceBool(is_active, true),
    files: normalizeFiles([], files, uploaded),
  };

  switch (recordType) {
    case "public_notice": {
      const desc =
        description != null && String(description).trim() !== ""
          ? description
          : content != null && String(content).trim() !== ""
            ? content
            : null;
      return {
        ...base,
        description: desc,
        content: content ?? desc,
        start_date: dateOnly(start_date),
        end_date: dateOnly(end_date),
        department_id: parseOptionalInt(department_id),
      };
    }
    case "tender":
      return {
        ...base,
        tender_number: normalizeTenderNumber(tender_number),
        start_date: dateOnly(start_date),
        end_date: dateOnly(end_date),
        department_id: parseOptionalInt(department_id),
      };
    case "council_decision": {
      const trimmedNo =
        decision_no != null && String(decision_no).trim() !== ""
          ? String(decision_no).trim()
          : null;
      return {
        ...base,
        decision_no: trimmedNo,
        date: dateOnly(date),
        summary: summary || description || null,
        full_text: full_text || null,
        department_id: parseOptionalInt(department_id),
      };
    }
    case "real_estate_listing":
      return {
        ...base,
        department_id: parseOptionalInt(department_id),
      };
    default:
      return base;
  }
}

function applyUpdate(row, body, uploaded) {
  const {
    title,
    description,
    content,
    is_active,
    files,
    start_date,
    end_date,
    department_id,
    tender_number,
    decision_no,
    date,
    summary,
    full_text,
  } = body;

  const patch = {};

  if (title !== undefined) patch.title = title;
  if (is_active !== undefined) patch.is_active = coerceBool(is_active, row.is_active);

  if (files !== undefined || uploaded.length) {
    if (row.record_type === "public_notice" && files === undefined) {
      const previous = Array.isArray(row.files) ? row.files : [];
      patch.files = normalizeFiles(previous, undefined, uploaded);
    } else {
      patch.files = normalizeFiles(row.files, files, uploaded);
    }
  }

  switch (row.record_type) {
    case "public_notice": {
      const desc =
        description !== undefined
          ? description
          : content !== undefined
            ? content
            : undefined;
      if (desc !== undefined) {
        patch.description = desc;
        patch.content = content ?? desc;
      } else if (content !== undefined) {
        patch.content = content;
        patch.description = content;
      }
      if (start_date !== undefined) patch.start_date = dateOnly(start_date);
      if (end_date !== undefined) patch.end_date = dateOnly(end_date);
      if (department_id !== undefined) patch.department_id = parseOptionalInt(department_id);
      break;
    }
    case "tender":
      if (description !== undefined) patch.description = description;
      if (tender_number !== undefined) patch.tender_number = normalizeTenderNumber(tender_number);
      if (start_date !== undefined) patch.start_date = dateOnly(start_date);
      if (end_date !== undefined) patch.end_date = dateOnly(end_date);
      if (department_id !== undefined) patch.department_id = parseOptionalInt(department_id);
      break;
    case "council_decision":
      if (description !== undefined) patch.description = description;
      if (decision_no !== undefined) {
        patch.decision_no =
          decision_no != null && String(decision_no).trim() !== ""
            ? String(decision_no).trim()
            : null;
      }
      if (date !== undefined) patch.date = dateOnly(date);
      if (summary !== undefined) patch.summary = summary || null;
      if (full_text !== undefined) patch.full_text = full_text || null;
      if (department_id !== undefined) patch.department_id = parseOptionalInt(department_id);
      break;
    case "real_estate_listing":
      if (description !== undefined) patch.description = description;
      if (department_id !== undefined) patch.department_id = parseOptionalInt(department_id);
      break;
    default:
      break;
  }

  return patch;
}

function validateDateRange(start, end) {
  return start && end && start > end;
}

const listIncludes = [
  {
    model: Department,
    as: "department",
    attributes: ["id", "name"],
    required: false,
  },
];

const detailIncludes = [...listIncludes];

exports.getAllPublications = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const recordTypes = parseRecordTypeFilter(req.query.record_type);
    const isActive = parseIsActiveFilter(req.query.is_active);

    const where = {};
    if (recordTypes?.length) where.record_type = { [Op.in]: recordTypes };
    if (isActive !== undefined) where.is_active = isActive;

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { tender_number: { [Op.iLike]: `%${search}%` } },
        { decision_no: { [Op.iLike]: `%${search}%` } },
        { summary: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const sortExpr = sortDateLiteral();

    const { rows, count } = await Publication.findAndCountAll({
      where,
      limit,
      offset,
      distinct: true,
      attributes: { include: [[sortExpr, "sort_date"]] },
      include: listIncludes,
      order: [
        [sortExpr, "DESC NULLS LAST"],
        ["id", "DESC"],
      ],
    });

    return res.json({
      success: 1,
      data: {
        publications: rows.map(mapPublicationRow),
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Yayınlar listelendi.",
    });
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ success: 0, data: null, message: err.message });
    }
    next(err);
  }
};

exports.getPublicationById = async (req, res, next) => {
  try {
    const sortExpr = sortDateLiteral();
    const row = await Publication.findByPk(req.params.id, {
      attributes: { include: [[sortExpr, "sort_date"]] },
      include: detailIncludes,
    });

    if (!row) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Yayın bulunamadı." });
    }

    return res.json({
      success: 1,
      data: mapPublicationRow(row),
      message: "Yayın getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createPublication = async (req, res, next) => {
  try {
    const recordType = req.body.record_type;
    if (!recordType || !isValidRecordType(recordType)) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: `record_type zorunludur (${RECORD_TYPES.join(", ")}).`,
      });
    }
    if (!req.body.title) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "title zorunludur.",
      });
    }

    const uploaded = collectUploadedFiles(req);
    const payload = buildCreatePayload(recordType, req.body, uploaded);

    if (
      (recordType === "tender" || recordType === "public_notice") &&
      validateDateRange(payload.start_date, payload.end_date)
    ) {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
      });
    }

    const created = await Publication.create(payload);

    return res.status(201).json({
      success: 1,
      data: mapPublicationRow(created),
      message: "Yayın oluşturuldu.",
    });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};

exports.updatePublication = async (req, res, next) => {
  try {
    const row = await Publication.findByPk(req.params.id);
    if (!row) {
      unlinkUploadedFiles(req);
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Yayın bulunamadı." });
    }

    const uploaded = collectUploadedFiles(req);
    const patch = applyUpdate(row, req.body, uploaded);

    const nextStart =
      patch.start_date !== undefined ? patch.start_date : row.start_date;
    const nextEnd =
      patch.end_date !== undefined ? patch.end_date : row.end_date;
    if (validateDateRange(nextStart, nextEnd)) {
      unlinkUploadedFiles(req);
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
      });
    }

    if (req.body.files !== undefined || uploaded.length) {
      const previousFiles = Array.isArray(row.files) ? row.files : [];
      const nextFiles = patch.files ?? previousFiles;
      deleteStoredFilePaths(previousFiles.filter((p) => !nextFiles.includes(p)));
    }

    await row.update(patch);

    return res.json({
      success: 1,
      data: mapPublicationRow(row),
      message: "Yayın güncellendi.",
    });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};

exports.deletePublication = async (req, res, next) => {
  try {
    const row = await Publication.findByPk(req.params.id);
    if (!row) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Yayın bulunamadı." });
    }

    const filesToDelete = Array.isArray(row.files) ? row.files : [];
    await row.destroy();
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    return res.json({
      success: 1,
      data: null,
      message: "Yayın silindi.",
    });
  } catch (err) {
    next(err);
  }
};
