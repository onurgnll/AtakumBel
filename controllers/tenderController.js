const { Tender } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");
const {
  normalizeFiles,
  collectUploadedFiles,
  unlinkUploadedFiles,
} = require("../helpers/normalizeUploadFiles");

function dateOnly(v) {
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim().slice(0, 10);
}

function normalizeTenderNumber(v) {
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim();
}

//Read
exports.getAllTenders = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { tender_number: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: tenders, count } = await Tender.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        tenders,
        pagination: getPagingData(count, req.query.page, limit),
        message: "İhaleler başarıyla listelendi.",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTenderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);
    if (!tender) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İhale bulunamadı." });
    }
    res.json({ success: 1, data: tender, message: "İhale bilgisi getirildi." });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createTender = async (req, res, next) => {
  try {
    const {
      title,
      description,
      publish_date,
      is_active,
      files,
      tender_number,
      start_date,
      end_date,
    } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: 0, data: null, message: "title zorunludur." });
    }
    const uploadedList = collectUploadedFiles(req);

    const start = dateOnly(start_date);
    const end = dateOnly(end_date);
    if (start && end && start > end) {
      uploadedList.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
      });
    }

    const newTender = await Tender.create({
      title,
      description: description || null,
      publish_date: publish_date ? dateOnly(publish_date) : null,
      tender_number: normalizeTenderNumber(tender_number),
      start_date: start,
      end_date: end,
      is_active: is_active ?? true,
      files: normalizeFiles([], files, uploadedList),
    });

    res.status(201).json({
      success: 1,
      data: newTender,
      message: "İhale kaydı başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateTender = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      publish_date,
      is_active,
      files,
      tender_number,
      start_date,
      end_date,
    } = req.body;

    const tender = await Tender.findByPk(id);
    if (!tender) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek ihale bulunamadı.",
      });
    }

    const uploadedList = collectUploadedFiles(req);

    const nextStart =
      start_date !== undefined ? dateOnly(start_date) : tender.start_date;
    const nextEnd =
      end_date !== undefined ? dateOnly(end_date) : tender.end_date;
    if (nextStart && nextEnd && nextStart > nextEnd) {
      uploadedList.forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Başlangıç tarihi bitiş tarihinden sonra olamaz.",
      });
    }

    await tender.update({
      title: title ?? tender.title,
      description: description ?? tender.description,
      publish_date:
        publish_date !== undefined
          ? dateOnly(publish_date)
          : tender.publish_date,
      tender_number:
        tender_number !== undefined
          ? normalizeTenderNumber(tender_number)
          : tender.tender_number,
      start_date: nextStart,
      end_date: nextEnd,
      is_active: is_active ?? tender.is_active,
      files: normalizeFiles(tender.files, files, uploadedList),
    });

    res.json({
      success: 1,
      data: tender,
      message: "İhale bilgileri başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteTender = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);

    if (!tender) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İhale bulunamadı." });
    }

    const filesToDelete = Array.isArray(tender.files) ? tender.files : [];
    await tender.destroy();
    filesToDelete.forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    res.json({ success: 1, data: null, message: "İhale kaydı silindi." });
  } catch (err) {
    next(err);
  }
};

