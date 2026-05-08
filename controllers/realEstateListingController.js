const { RealEstateListing } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

const normalizeFiles = (existingFiles, bodyFiles, uploadedFile) => {
  const files = Array.isArray(existingFiles) ? [...existingFiles] : [];

  if (bodyFiles) {
    if (Array.isArray(bodyFiles)) {
      files.push(...bodyFiles);
    } else if (typeof bodyFiles === "string") {
      try {
        const parsed = JSON.parse(bodyFiles);
        if (Array.isArray(parsed)) files.push(...parsed);
        else files.push(bodyFiles);
      } catch {
        files.push(bodyFiles);
      }
    }
  }

  if (uploadedFile) {
    files.push(uploadedFile.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"));
  }

  return files;
};

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
      message: "Emlak ilanlarÄ± listelendi.",
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
        .json({ success: 0, data: null, message: "Emlak ilanÄ± bulunamadÄ±." });
    }
    return res.json({ success: 1, data: listing, message: "Emlak ilanÄ± getirildi." });
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
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    const listing = await RealEstateListing.create({
      title,
      description: description || null,
      publish_date: publish_date || null,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedFile),
    });

    return res
      .status(201)
      .json({ success: 1, data: listing, message: "Emlak ilanÄ± oluÅŸturuldu." });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.updateRealEstateListing = async (req, res, next) => {
  try {
    const listing = await RealEstateListing.findByPk(req.params.id);
    if (!listing) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Emlak ilanÄ± bulunamadÄ±." });
    }

    const { title, description, publish_date, is_active, files } = req.body;
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    await listing.update({
      title: title ?? listing.title,
      description: description ?? listing.description,
      publish_date: publish_date ?? listing.publish_date,
      is_active: is_active ?? listing.is_active,
      files: normalizeFiles(listing.files, files, uploadedFile),
    });

    return res.json({
      success: 1,
      data: listing,
      message: "Emlak ilanÄ± gÃ¼ncellendi.",
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(err);
  }
};

exports.deleteRealEstateListing = async (req, res, next) => {
  try {
    const listing = await RealEstateListing.findByPk(req.params.id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Emlak ilanÄ± bulunamadÄ±." });
    }

    const filesToDelete = Array.isArray(listing.files) ? listing.files : [];
    await listing.destroy();
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    return res.json({
      success: 1,
      data: null,
      message: "Emlak ilanÄ± silindi.",
    });
  } catch (err) {
    next(err);
  }
};


