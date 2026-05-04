const { Report } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { subtle } = require("crypto");

//Read
exports.getAllReports = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { type } = req.query;

    const whereCondition = type ? { type } : {};

    const { rows: reports, count } = await Report.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      success: 1,
      data: {
        reports,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Raporlar listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Create
exports.createReport = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    const allowedTypes = [
      "activity",
      "financial",
      "performance",
      "audit",
      "strategic",
      "kvkk",
    ];

    if (!allowedTypes.includes(type)) {
      if (req.file) fs.unlinkSync(req.file.path);
      if (req.files) {
        const files = Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat();
        files.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      }

      return res.status(400).json({
        success: 0,
        message: `Geçersiz rapor tipi. Şunlardan biri olmalı: ${allowedTypes.join(", ")}`,
      });
    }
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);

    if (!uploadedFile) {
      return res.status(400).json({
        success: 0,
        message: "Lütfen bir rapor dosyası yükleyin.",
      });
    }

    const file_url = uploadedFile.path.replace(/\\/g, "/");
    const file_type = uploadedFile.mimetype;

    // Boyutu okunabilir formata çevirme (MB cinsinden)
    const sizeInBytes = uploadedFile.size;
    const file_size = (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";

    const newReport = await Report.create({
      name,
      file_url,
      file_type,
      file_size,
      type,
    });

    res.status(201).json({
      success: 1,
      data: newReport,
      message: "Rapor dosyası meta verileriyle birlikte kaydedildi.",
    });
  } catch (err) {
    const fileToClean =
      req.file || (req.files && Object.values(req.files).flat()[0]);
    if (fileToClean && fs.existsSync(fileToClean.path)) {
      fs.unlinkSync(fileToClean.path);
    }
    next(err);
  }
};
//Update
exports.updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const report = await Report.findByPk(id);

    if (!report) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek rapor bulunamadı.",
      });
    }

    let file_url = report.file_url;
    let file_size = report.file_size;
    let file_type = report.file_type;

    if (req.file) {
      if (report.file_url && fs.existsSync(report.file_url)) {
        fs.unlinkSync(report.file_url);
      }
      file_url = req.file.path.replace(/\\/g, "/");
      file_size = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";
      file_type = req.file.mimetype;
    }

    await report.update({
      name: name ?? report.name,
      type: type ?? report.type,
      file_url: file_url ?? report.file_url,
      file_size: file_size ?? report.file_size,
      file_type: file_type ?? report.file_type,
    });

    res.json({ success: 1, data: report, message: "Rapor güncellendi." });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

//Delete
exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek rapor bulunamadı.",
      });
    }

    const filePath = report.file_url;

    await report.destroy();

    if (report.file_url && fs.existsSync(report.file_url)) {
      fs.unlinkSync(report.file_url);
    }

    res.json({
      success: 1,
      data: null,
      message: "Rapor ve bağlı dosya başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
