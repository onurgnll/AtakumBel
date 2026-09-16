"use strict";

const { AtakumWebsite, sequelize } = require("../models");
const { Op } = require("sequelize");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { reorderByIds, getNextSortOrder } = require("../helpers/reorderEntities");

function coerceBoolean(value, whenMissing) {
  if (value === undefined || value === null || value === "") return whenMissing;
  if (typeof value === "boolean") return value;
  const v = String(value).toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return Boolean(value);
}

function normalizeKind(value) {
  const k = String(value ?? "website").trim().toLowerCase();
  return k === "app" ? "app" : "website";
}

function normalizeOptionalText(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

exports.getAllAtakumWebsites = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const isAdmin = req.query.admin === "true";
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = isAdmin ? {} : { is_active: true };
    if (search) {
      whereCondition[Op.or] = [
        { label: { [Op.iLike]: `%${search}%` } },
        { href: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { badge: { [Op.iLike]: `%${search}%` } },
        { section_title: { [Op.iLike]: `%${search}%` } },
        { section_key: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: atakum_websites, count } = await AtakumWebsite.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.json({
      success: 1,
      data: {
        atakum_websites,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Web siteleri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAtakumWebsiteById = async (req, res, next) => {
  try {
    const row = await AtakumWebsite.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Web sitesi kaydı bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: row,
      message: "Web sitesi detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createAtakumWebsite = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      label,
      href,
      description,
      badge,
      kind,
      section_key,
      section_title,
      is_active,
    } = req.body;

    const nextOrder = await getNextSortOrder(AtakumWebsite, t);
    const created = await AtakumWebsite.create(
      {
        label,
        href,
        description: normalizeOptionalText(description),
        badge: normalizeOptionalText(badge),
        kind: normalizeKind(kind),
        section_key: normalizeOptionalText(section_key) || "genel",
        section_title: normalizeOptionalText(section_title),
        order: nextOrder,
        is_active: coerceBoolean(is_active, true),
      },
      { transaction: t },
    );

    await t.commit();
    return res.status(201).json({
      success: 1,
      data: created,
      message: "Web sitesi kaydı oluşturuldu.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.updateAtakumWebsite = async (req, res, next) => {
  try {
    const row = await AtakumWebsite.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Web sitesi kaydı bulunamadı.",
      });
    }

    const {
      label,
      href,
      description,
      badge,
      kind,
      section_key,
      section_title,
      is_active,
    } = req.body;

    await row.update({
      ...(label !== undefined ? { label } : {}),
      ...(href !== undefined ? { href } : {}),
      ...(description !== undefined
        ? { description: normalizeOptionalText(description) }
        : {}),
      ...(badge !== undefined ? { badge: normalizeOptionalText(badge) } : {}),
      ...(kind !== undefined ? { kind: normalizeKind(kind) } : {}),
      ...(section_key !== undefined
        ? { section_key: normalizeOptionalText(section_key) || "genel" }
        : {}),
      ...(section_title !== undefined
        ? { section_title: normalizeOptionalText(section_title) }
        : {}),
      ...(is_active !== undefined
        ? { is_active: coerceBoolean(is_active, row.is_active) }
        : {}),
    });

    return res.json({
      success: 1,
      data: row,
      message: "Web sitesi kaydı güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.reorderAtakumWebsites = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { ids } = req.body;
    await reorderByIds(AtakumWebsite, ids, t);
    await t.commit();
    const atakum_websites = await AtakumWebsite.findAll({
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.json({
      success: 1,
      data: { atakum_websites },
      message: "Sıralama güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteAtakumWebsite = async (req, res, next) => {
  try {
    const row = await AtakumWebsite.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek web sitesi kaydı bulunamadı.",
      });
    }
    await row.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Web sitesi kaydı silindi.",
    });
  } catch (err) {
    next(err);
  }
};
