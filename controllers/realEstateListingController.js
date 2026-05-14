const { RealEstateListing } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
} = require("../helpers/normalizeUploadFiles");

exports.getAllRealEstateListings = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(req.query.page, req.query.per_page);
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: listings, count } = await RealEstateListing.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        listings,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Emlak ilanları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getRealEstateListingById = async (req, res, next) => {
  try {
    const listing = await RealEstateListing.findByPk(req.params.id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Emlak ilanı bulunamadı." });
    }
    return res.json({ success: 1, data: listing, message: "Emlak ilanı getirildi." });
  } catch (err) {
    next(err);
  }
};

exports.createRealEstateListing = async (req, res, next) => {
  try {
    const { title, description, publish_date, is_active, files } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: 0, data: null, message: "title zorunludur." });
    }
    const uploadedList = collectUploadedFiles(req);

    const listing = await RealEstateListing.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedList),
    });

    return res
      .status(201)
      .json({ success: 1, data: listing, message: "Emlak ilanı oluşturuldu." });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};

exports.updateRealEstateListing = async (req, res, next) => {
  try {
    const listing = await RealEstateListing.findByPk(req.params.id);
    if (!listing) {
      unlinkUploadedFiles(req);
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Emlak ilanı bulunamadı." });
    }

    const { title, description, publish_date, is_active, files } = req.body;
    const uploadedList = collectUploadedFiles(req);

    await listing.update({
      title: title ?? listing.title,
      description: description ?? listing.description,
      publish_date: publish_date ?? listing.publish_date,
      is_active: is_active ?? listing.is_active,
      files: normalizeFiles(listing.files, files, uploadedList),
    });

    return res.json({
      success: 1,
      data: listing,
      message: "Emlak ilanı güncellendi.",
    });
  } catch (err) {
    unlinkUploadedFiles(req);
    next(err);
  }
};

exports.deleteRealEstateListing = async (req, res, next) => {
  try {
    const listing = await RealEstateListing.findByPk(req.params.id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Emlak ilanı bulunamadı." });
    }

    const filesToDelete = Array.isArray(listing.files) ? listing.files : [];
    await listing.destroy();
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    return res.json({
      success: 1,
      data: null,
      message: "Emlak ilanı silindi.",
    });
  } catch (err) {
    next(err);
  }
};


