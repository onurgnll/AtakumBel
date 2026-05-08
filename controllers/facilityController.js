const { FacilityGallery, Facility, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  if (req.file) return [req.file];
  return [];
};

//Read
exports.getAllFacilities = async (req, res, next) => {
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
            { address: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: facilities, count } = await Facility.findAndCountAll({
      where: whereCondition,
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
        message: "GÃ¶rÃ¼ntÃ¼lenecek tesis bulunamadÄ±.",
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
  let transaction;
  try {
    const { name, address, description, latitude, longitude } = req.body;
    const uploadedFiles = getUploadedFiles(req);
    const existing = await Facility.findOne({ where: { name } });
    if (existing) {
      uploadedFiles.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(409).json({
        success: 0,
        data: existing,
        message: "Bu tesis zaten kayÄ±tlÄ±.",
      });
    }
    transaction = await sequelize.transaction();
    const newFacility = await Facility.create(
      {
        name,
        address,
        description: description ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
      { transaction },
    );

    if (uploadedFiles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Tesis oluÅŸtururken en az bir gÃ¶rsel yÃ¼klenmelidir.",
      });
    }

    await Promise.all(
      uploadedFiles.map((file, index) =>
        FacilityGallery.create(
          {
            facility_id: newFacility.id,
            image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
            order: index + 1,
            is_main: index === 0,
          },
          { transaction },
        ),
      ),
    );
    await transaction.commit();

    return res.status(201).json({
      success: 1,
      data: newFacility,
      message: "Tesis baÅŸarÄ±yla eklendi.",
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    const uploadedFiles = getUploadedFiles(req);
    uploadedFiles.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    next(err);
  }
};

//Update
exports.updateFacility = async (req, res, next) => {
  let transaction;
  try {
    const { id } = req.params;
    const { name, address, description, latitude, longitude } = req.body;
    const facility = await Facility.findByPk(id);
    if (!facility) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "GÃ¼ncellenecek tesis bulunamadÄ±.",
      });
    }
    await facility.update({
      name: name ?? facility.name,
      address: address ?? facility.address,
      description: description ?? facility.description,
      latitude: latitude ?? facility.latitude,
      longitude: longitude ?? facility.longitude,
    });

    const uploadedFiles = getUploadedFiles(req);
    if (uploadedFiles.length > 0) {
      transaction = await sequelize.transaction();
      await FacilityGallery.update(
        { is_main: false },
        { where: { facility_id: facility.id, is_main: true }, transaction },
      );
      const maxOrder = await FacilityGallery.max("order", {
        where: { facility_id: facility.id },
      });
      const startOrder = Number(maxOrder) > 0 ? Number(maxOrder) + 1 : 1;
      await Promise.all(
        uploadedFiles.map((file, index) =>
          FacilityGallery.create(
            {
              facility_id: facility.id,
              image_url: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
              order: startOrder + index,
              is_main: index === 0,
            },
            { transaction },
          ),
        ),
      );
      await transaction.commit();
    }

    return res.json({
      success: 1,
      data: facility,
      message: "Tesis bilgileri gÃ¼ncellendi.",
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    const uploadedFiles = getUploadedFiles(req);
    uploadedFiles.forEach((file) => {
      if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
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
        message: "Silinecek tesis bulunamadÄ±",
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
      message: "Tesis baÅŸarÄ±yla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

