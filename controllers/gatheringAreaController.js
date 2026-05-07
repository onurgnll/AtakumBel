"use strict";

const { GatheringArea } = require("../models");
const { Op } = require("sequelize");

exports.getAllGatheringAreas = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const areas = await GatheringArea.findAll({ where: whereCondition });
    return res.json({
      success: 1,
      data: areas,
      message: "Toplanma alanları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

