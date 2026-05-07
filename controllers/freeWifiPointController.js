"use strict";

const { FreeWifiPoint } = require("../models");
const { Op } = require("sequelize");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

exports.getAllFreeWifiPoints = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const { rows: points, count } = await FreeWifiPoint.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    return res.json({
      success: 1,
      data: {
        free_wifi_points: points,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Ücretsiz WiFi noktaları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getFreeWifiPointById = async (req, res, next) => {
  try {
    const point = await FreeWifiPoint.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "WiFi noktası bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: point,
      message: "WiFi noktası detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createFreeWifiPoint = async (req, res, next) => {
  try {
    const { name, latitude, longitude } = req.body;
    const created = await FreeWifiPoint.create({ name, latitude, longitude });
    return res
      .status(201)
      .json({ success: 1, data: created, message: "WiFi noktası eklendi." });
  } catch (err) {
    next(err);
  }
};

exports.updateFreeWifiPoint = async (req, res, next) => {
  try {
    const point = await FreeWifiPoint.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "WiFi noktası bulunamadı.",
      });
    }
    const { name, latitude, longitude } = req.body;
    await point.update({
      name: name ?? point.name,
      latitude: latitude ?? point.latitude,
      longitude: longitude ?? point.longitude,
    });
    return res.json({
      success: 1,
      data: point,
      message: "WiFi noktası güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFreeWifiPoint = async (req, res, next) => {
  try {
    const point = await FreeWifiPoint.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "WiFi noktası bulunamadı.",
      });
    }
    await point.destroy();
    return res
      .json({ success: 1, data: null, message: "WiFi noktası silindi." });
  } catch (err) {
    next(err);
  }
};

