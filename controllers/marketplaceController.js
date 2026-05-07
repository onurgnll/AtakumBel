"use strict";

const { Marketplace } = require("../models");
const { Op } = require("sequelize");

exports.getAllMarketplaces = async (req, res, next) => {
  try {
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { day_of_week: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const markets = await Marketplace.findAll({ where: whereCondition });
    return res.json({
      success: 1,
      data: markets,
      message: "Pazar yerleri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

