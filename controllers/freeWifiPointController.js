"use strict";

const { FreeWifiPoint } = require("../models");
const { Op } = require("sequelize");

exports.getAllFreeWifiPoints = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const points = await FreeWifiPoint.findAll({ where: whereCondition });
    return res.json({
      success: 1,
      data: points,
      message: "Ücretsiz WiFi noktaları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

