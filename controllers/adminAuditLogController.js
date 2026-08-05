const { AdminAuditLog, Admin } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

const ALLOWED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function parsePositiveInt(value) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseDateBoundary(value, endOfDay) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    d.setHours(23, 59, 59, 999);
  }
  return d;
}

function sanitizeModuleSlug(value) {
  if (!value || typeof value !== "string") return null;
  const slug = value.trim().toLowerCase();
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  return slug;
}

function modulePathFilter(moduleSlug) {
  return {
    [Op.or]: [
      { path: { [Op.iLike]: `%/${moduleSlug}` } },
      { path: { [Op.iLike]: `%/${moduleSlug}/%` } },
      { path: { [Op.iLike]: `%/${moduleSlug}?%` } },
    ],
  };
}

function statusGroupFilter(group) {
  if (group === "success") {
    return { status_code: { [Op.between]: [200, 399] } };
  }
  if (group === "client_error") {
    return { status_code: { [Op.between]: [400, 499] } };
  }
  if (group === "server_error") {
    return { status_code: { [Op.gte]: 500 } };
  }
  return null;
}

exports.getAll = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? String(req.query.search).trim() : "";
    const adminIdFilter = parsePositiveInt(req.query.admin_id);
    const methodRaw = req.query.method
      ? String(req.query.method).trim().toUpperCase()
      : "";
    const method = ALLOWED_METHODS.has(methodRaw) ? methodRaw : null;
    const statusCode = parsePositiveInt(req.query.status_code);
    const statusGroup =
      typeof req.query.status_group === "string"
        ? req.query.status_group.trim()
        : "";
    const moduleSlug = sanitizeModuleSlug(req.query.module);
    const fromDate = parseDateBoundary(req.query.from, false);
    const toDate = parseDateBoundary(req.query.to, true);

    const andConditions = [];

    // Yönetici adı/e-posta aramasını ayrı yapıyoruz; `$admin.x$` Sequelize count'ta
    // "missing FROM-clause entry" hatasına yol açıyor.
    if (search) {
      const matchingAdmins = await Admin.findAll({
        attributes: ["id"],
        where: {
          [Op.or]: [
            { email: { [Op.iLike]: `%${search}%` } },
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
          ],
        },
      });
      const matchedAdminIds = matchingAdmins.map((a) => a.id);
      const searchOr = [
        { path: { [Op.iLike]: `%${search}%` } },
        { ip: { [Op.iLike]: `%${search}%` } },
      ];
      if (matchedAdminIds.length > 0) {
        searchOr.push({ admin_id: { [Op.in]: matchedAdminIds } });
      }
      andConditions.push({ [Op.or]: searchOr });
    }

    if (adminIdFilter) {
      andConditions.push({ admin_id: adminIdFilter });
    }

    if (method) {
      andConditions.push({ method });
    }

    if (statusCode) {
      andConditions.push({ status_code: statusCode });
    } else {
      const groupFilter = statusGroupFilter(statusGroup);
      if (groupFilter) andConditions.push(groupFilter);
    }

    if (moduleSlug) {
      andConditions.push(modulePathFilter(moduleSlug));
    }

    if (fromDate || toDate) {
      const createdAt = {};
      if (fromDate) createdAt[Op.gte] = fromDate;
      if (toDate) createdAt[Op.lte] = toDate;
      andConditions.push({ createdAt });
    }

    const where =
      andConditions.length === 0
        ? {}
        : andConditions.length === 1
          ? andConditions[0]
          : { [Op.and]: andConditions };

    const count = await AdminAuditLog.count({ where });

    const rows = await AdminAuditLog.findAll({
      where,
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "email", "first_name", "last_name", "role"],
          required: false,
        },
      ],
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        audit_logs: rows,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "İşlem günlüğü listelendi.",
    });
  } catch (err) {
    next(err);
  }
};
