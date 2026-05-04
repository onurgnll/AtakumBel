const { FacilityGallery, Facility, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

//Read
exports.getAllFacilities = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: facilities, count } = await Facility.findAndCountAll({
      limit,
      offset,
      include: [
        { model: FacilityGallery, as: "gallery", where: { is_main: true } },
      ],
      distinct: true,
    });
    return res.json({
      success: 1,
      data: {
        facilities,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Tesisler listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getFacilityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facilityItem = await Facility.findByPk(id, {
      include: [{ model: FacilityGallery, as: "gallery" }],
    });

    if (!facilityItem) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Görüntülenecek tesis bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: facilityItem,
      message: "Tesis bilgileri getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createFacility = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const existing = await Facility.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: 0,
        data: existing,
        message: "Bu tesis zaten kayıtlı.",
      });
    }
    const newFacility = await Facility.create({ name, address });
    return res.status(201).json({
      success: 1,
      data: newFacility,
      message: "Tesis başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateFacility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    const facility = await Facility.findByPk(id);
    if (!facility) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek tesis bulunamadı.",
      });
    }
    await facility.update({
      name: name ?? facility.name,
      address: address ?? facility.address,
    });
    return res.json({
      success: 1,
      data: facility,
      message: "Tesis bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteFacility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByPk(id, {
      include: [{ model: FacilityGallery, as: "gallery" }],
    });
    if (!facility) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek tesis bulunamadı",
      });
    }
    const imagesToDelete = facility.gallery
      ? facility.gallery.map((img) => img.image_url)
      : [];

    await facility.destroy();

    imagesToDelete.forEach((path) => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });

    return res.json({
      success: 1,
      data: null,
      message: "Tesis başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
