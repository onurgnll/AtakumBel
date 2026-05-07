"use strict";

const { WastePoint } = require("../models");
const { Op } = require("sequelize");

exports.getAllWastePoints = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const points = await WastePoint.findAll({ where: whereCondition });
    return res.json({
      success: 1,
      data: points,
      message: "Atık noktaları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

