"use strict";

const { GatheringArea } = require("../models");
const { Op } = require("sequelize");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

exports.getAllGatheringAreas = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};
    const { rows: areas, count } = await GatheringArea.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    return res.json({
      success: 1,
      data: {
        gathering_areas: areas,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Toplanma alanları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getGatheringAreaById = async (req, res, next) => {
  try {
    const area = await GatheringArea.findByPk(req.params.id);
    if (!area) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Toplanma alanı bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: area,
      message: "Toplanma alanı detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createGatheringArea = async (req, res, next) => {
  try {
    const { name, latitude, longitude } = req.body;
    const created = await GatheringArea.create({ name, latitude, longitude });
    return res.status(201).json({
      success: 1,
      data: created,
      message: "Toplanma alanı eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateGatheringArea = async (req, res, next) => {
  try {
    const area = await GatheringArea.findByPk(req.params.id);
    if (!area) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Toplanma alanı bulunamadı.",
      });
    }
    const { name, latitude, longitude } = req.body;
    await area.update({
      name: name ?? area.name,
      latitude: latitude ?? area.latitude,
      longitude: longitude ?? area.longitude,
    });
    return res.json({
      success: 1,
      data: area,
      message: "Toplanma alanı güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGatheringArea = async (req, res, next) => {
  try {
    const area = await GatheringArea.findByPk(req.params.id);
    if (!area) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Toplanma alanı bulunamadı.",
      });
    }
    await area.destroy();
    return res
      .json({ success: 1, data: null, message: "Toplanma alanı silindi." });
  } catch (err) {
    next(err);
  }
};

