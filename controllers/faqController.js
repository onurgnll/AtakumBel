"use strict";

const { Faq, sequelize } = require("../models");
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

//Read
exports.getAllFaqs = async (req, res, next) => {
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
        { question: { [Op.iLike]: `%${search}%` } },
        { answer: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: faqs, count } = await Faq.findAndCountAll({
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
        faqs,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Sıkça sorulan sorular listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getFaqById = async (req, res, next) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Soru bulunamadı." });
    }
    return res.json({
      success: 1,
      data: faq,
      message: "Soru detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createFaq = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { question, answer, category, is_active } = req.body;

    const nextOrder = await getNextSortOrder(Faq, t);
    const newFaq = await Faq.create(
      {
        question,
        answer,
        category: category === "" ? null : (category ?? null),
        order: nextOrder,
        is_active: coerceBoolean(is_active, true),
      },
      { transaction: t },
    );

    await t.commit();
    return res.status(201).json({
      success: 1,
      data: newFaq,
      message: "Soru başarıyla oluşturuldu.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// Update
exports.updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Soru bulunamadı." });
    }

    const { question, answer, category, is_active } = req.body;

    await faq.update({
      ...(question !== undefined ? { question } : {}),
      ...(answer !== undefined ? { answer } : {}),
      ...(category !== undefined
        ? { category: category === "" ? null : category }
        : {}),
      ...(is_active !== undefined
        ? { is_active: coerceBoolean(is_active, faq.is_active) }
        : {}),
    });

    return res.json({
      success: 1,
      data: faq,
      message: "Soru başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.reorderFaqs = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { ids } = req.body;
    await reorderByIds(Faq, ids, t);
    await t.commit();
    const faqs = await Faq.findAll({
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.json({
      success: 1,
      data: { faqs },
      message: "Sıralama güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    if (err.code === "INVALID_IDS" || err.code === "INCOMPLETE_LIST") {
      return res
        .status(400)
        .json({ success: 0, data: null, message: err.message });
    }
    if (err.code === "NOT_FOUND") {
      return res
        .status(404)
        .json({ success: 0, data: null, message: err.message });
    }
    next(err);
  }
};

// Delete
exports.deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByPk(req.params.id);
    if (!faq) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Soru bulunamadı." });
    }

    await faq.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Soru sistemden kaldırıldı.",
    });
  } catch (err) {
    next(err);
  }
};
