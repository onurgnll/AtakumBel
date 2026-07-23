"use strict";

const { Muhtar, sequelize } = require("../models");
const { Op } = require("sequelize");
const { buildTurkishLikeOr } = require("../helpers/turkishSearch");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { reorderByIds, getNextSortOrder } = require("../helpers/reorderEntities");
const fs = require("fs");
const path = require("path");

function resolveImageDiskPath(image_url) {
  if (!image_url) return null;
  return path.join("public", image_url);
}

function deleteImageFile(image_url) {
  const diskPath = resolveImageDiskPath(image_url);
  if (diskPath && fs.existsSync(diskPath)) {
    fs.unlinkSync(diskPath);
  }
}

function isTruthyFlag(value) {
  return value === true || value === "1" || value === "true";
}

//Read
exports.getAllMuhtars = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: buildTurkishLikeOr(
            ["mahalle_name", "first_name", "last_name"],
            search,
            sequelize,
          ),
        }
      : {};
    const { rows: muhtars, count } = await Muhtar.findAndCountAll({
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
        muhtars,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Muhtarlar listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getMuhtarById = async (req, res, next) => {
  try {
    const muhtar = await Muhtar.findByPk(req.params.id);
    if (!muhtar) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Muhtar bulunamadı." });
    }
    return res.json({
      success: 1,
      data: muhtar,
      message: "Muhtar detayı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createMuhtar = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      mahalle_name,
      first_name,
      last_name,
      address,
      phone,
      email,
      latitude,
      longitude,
      location_unset,
    } = req.body;

    const locationUnset = isTruthyFlag(location_unset);

    const image_path = req.file
      ? req.file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/")
      : null;

    const nextOrder = await getNextSortOrder(Muhtar, t);
    const newMuhtar = await Muhtar.create(
      {
        mahalle_name,
        first_name,
        last_name,
        address: address ?? null,
        phone: phone ?? null,
        email: email ?? null,
        latitude: locationUnset ? null : (latitude || null),
        longitude: locationUnset ? null : (longitude || null),
        image_url: image_path,
        order: nextOrder,
      },
      { transaction: t },
    );

    await t.commit();
    return res.status(201).json({
      success: 1,
      data: newMuhtar,
      message: "Muhtar eklendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//Update
exports.updateMuhtar = async (req, res, next) => {
  try {
    const muhtar = await Muhtar.findByPk(req.params.id);
    if (!muhtar) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Muhtar bulunamadı." });
    }

    const {
      mahalle_name,
      first_name,
      last_name,
      address,
      phone,
      email,
      latitude,
      longitude,
      location_unset,
    } = req.body;
    let image_path = muhtar.image_url;

    if (req.file) {
      deleteImageFile(muhtar.image_url);
      image_path = req.file.path
        .replace(/\\/g, "/")
        .replace(/^.*?(\/uploads\/)/, "/uploads/");
    }

    const locationUnset = location_unset !== undefined
      ? isTruthyFlag(location_unset)
      : null;

    await muhtar.update({
      mahalle_name: mahalle_name ?? muhtar.mahalle_name,
      first_name: first_name ?? muhtar.first_name,
      last_name: last_name ?? muhtar.last_name,
      address: address ?? muhtar.address,
      phone: phone ?? muhtar.phone,
      email: email ?? muhtar.email,
      latitude: locationUnset === true ? null : (latitude || muhtar.latitude),
      longitude: locationUnset === true ? null : (longitude || muhtar.longitude),
      image_url: image_path,
    });

    return res.json({
      success: 1,
      data: muhtar,
      message: "Muhtar bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.reorderMuhtars = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { ids } = req.body;
    await reorderByIds(Muhtar, ids, t);
    await t.commit();
    const muhtars = await Muhtar.findAll({
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.json({
      success: 1,
      data: { muhtars },
      message: "Sıralama güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    if (err.code === "INVALID_IDS" || err.code === "INCOMPLETE_LIST") {
      return res.status(400).json({ success: 0, data: null, message: err.message });
    }
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ success: 0, data: null, message: err.message });
    }
    next(err);
  }
};

//Delete
exports.deleteMuhtar = async (req, res, next) => {
  try {
    const muhtar = await Muhtar.findByPk(req.params.id);
    if (!muhtar) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek muhtar bulunamadı.",
      });
    }
    const imageToDelete = muhtar.image_url;
    await muhtar.destroy();
    deleteImageFile(imageToDelete);
    return res.json({ success: 1, data: null, message: "Muhtar silindi." });
  } catch (err) {
    next(err);
  }
};
