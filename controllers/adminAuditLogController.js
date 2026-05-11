const { AdminAuditLog, Admin } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

exports.getAll = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(req.query.page, req.query.per_page);
    const search = req.query.search ? req.query.search.trim() : null;
    const adminIdFilter = req.query.admin_id
      ? Number.parseInt(String(req.query.admin_id), 10)
      : null;

    const where = {};
    if (search) {
      where.path = { [Op.iLike]: `%${search}%` };
    }
    if (Number.isFinite(adminIdFilter) && adminIdFilter > 0) {
      where.admin_id = adminIdFilter;
    }

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
