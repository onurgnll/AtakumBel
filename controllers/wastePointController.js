"use strict";

const { WastePoint } = require("../models");
const { Op } = require("sequelize");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

exports.getAllWastePoints = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const { rows: points, count } = await WastePoint.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    return res.json({
      success: 1,
      data: {
        waste_points: points,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Atık noktaları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getWastePointById = async (req, res, next) => {
  try {
    const point = await WastePoint.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Atık noktası bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: point,
      message: "Atık noktası detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createWastePoint = async (req, res, next) => {
  try {
    const { name, latitude, longitude } = req.body;
    const created = await WastePoint.create({ name, latitude, longitude });
    return res
      .status(201)
      .json({ success: 1, data: created, message: "Atık noktası eklendi." });
  } catch (err) {
    next(err);
  }
};

exports.updateWastePoint = async (req, res, next) => {
  try {
    const point = await WastePoint.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Atık noktası bulunamadı.",
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
      message: "Atık noktası güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteWastePoint = async (req, res, next) => {
  try {
    const point = await WastePoint.findByPk(req.params.id);
    if (!point) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Atık noktası bulunamadı.",
      });
    }
    await point.destroy();
    return res
      .json({ success: 1, data: null, message: "Atık noktası silindi." });
  } catch (err) {
    next(err);
  }
};

