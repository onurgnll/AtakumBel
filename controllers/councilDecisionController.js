const { CouncilDecision, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");
const fs = require("fs");

//Read
exports.getAllDecisions = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { year } = req.query;
    const whereCondition = year
      ? { decision_date: { [Op.between]: [`${year}-01-01`, `${year}-12-31`] } }
      : {};

    const { rows: decisions, count } = await CouncilDecision.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        ["date", "DESC"],
        ["decision_no", "DESC"],
      ],
    });

    return res.json({
      success: 1,
      data: {
        decisions,
        pagination: getPagingData(count, req.query.page, limit),
        message: "meclis kararları listelendi",
      },
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createDecision = async (req, res, next) => {
  try {
    const { decision_no, summary, full_text, council_id } = req.body;

    const existing = await CouncilDecision.findOne({
      where: { decision_no },
    });
    if (existing) {
      return res.status(409).json({
        success: 0,
        data: existing,
        message: "Bu karar numarası bir kayıt var.",
      });
    }

    const newDecision = await CouncilDecision.create({
      decision_no,
      date: new Date(),
      summary,
      full_text,
      council_id,
    });

    res.status(201).json({
      success: 1,
      data: newDecision,
      message: "Karar başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateDecision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision_no, summary, full_text, council_id } = req.body;
    const decision = await CouncilDecision.findByPk(id);
    if (!decision) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Karar bulunamadı." });
    }
    const updatedDecision = await decision.update({
      decision_no: decision_no ?? decision.decision_no,
      summary: summary ?? decision.summary,
      full_text: full_text ?? decision.full_text,
      council_id: council_id ?? decision.council_id,
    });
    res.json({
      success: 1,
      data: updatedDecision,
      message: "Karar başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteDecision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const decision = await CouncilDecision.findByPk(id);

    if (!decision) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Karar bulunamadı." });
    }

    await decision.destroy();
    res.json({
      success: 1,
      data: null,
      message: "Karar başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
