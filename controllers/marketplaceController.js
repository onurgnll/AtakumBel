"use strict";

const { Marketplace } = require("../models");
const { Op } = require("sequelize");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

exports.getAllMarketplaces = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { day_of_week: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: markets, count } = await Marketplace.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    return res.json({
      success: 1,
      data: {
        marketplaces: markets,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Pazar yerleri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getMarketplaceById = async (req, res, next) => {
  try {
    const marketplace = await Marketplace.findByPk(req.params.id);
    if (!marketplace) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Pazar yeri bulunamadı." });
    }
    return res.json({
      success: 1,
      data: marketplace,
      message: "Pazar yeri detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createMarketplace = async (req, res, next) => {
  try {
    const { name, latitude, longitude, day_of_week } = req.body;
    const created = await Marketplace.create({
      name,
      latitude,
      longitude,
      day_of_week,
    });
    return res.status(201).json({
      success: 1,
      data: created,
      message: "Pazar yeri eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMarketplace = async (req, res, next) => {
  try {
    const marketplace = await Marketplace.findByPk(req.params.id);
    if (!marketplace) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Pazar yeri bulunamadı." });
    }
    const { name, latitude, longitude, day_of_week } = req.body;
    await marketplace.update({
      name: name ?? marketplace.name,
      latitude: latitude ?? marketplace.latitude,
      longitude: longitude ?? marketplace.longitude,
      day_of_week: day_of_week ?? marketplace.day_of_week,
    });
    return res.json({
      success: 1,
      data: marketplace,
      message: "Pazar yeri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMarketplace = async (req, res, next) => {
  try {
    const marketplace = await Marketplace.findByPk(req.params.id);
    if (!marketplace) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Pazar yeri bulunamadı." });
    }
    await marketplace.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Pazar yeri silindi.",
    });
  } catch (err) {
    next(err);
  }
};

