const {
  PublicNotice,
  Department,
  CouncilDecision,
  Tender,
  sequelize,
} = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

// Read
exports.getAllNotices = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { status } = req.query;

    const whereCondition = status ? { status } : {};

    const { rows: notices, count } = await PublicNotice.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes: ["id", "title", "status", "department_id"],
      include: [{ model: Department, as: "department", attributes: ["name"] }],
      order: [["id", "DESC"]],
      distinct: true,
    });

    return res.json({
      success: 1,
      data: {
        notices,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Duyurular listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getNoticeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await PublicNotice.findByPk(id, {
      include: [
        { model: Department, as: "department" },
        { model: CouncilDecision, as: "decision" },
        { model: Tender, as: "tenders" },
      ],
    });

    if (!notice) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İlan bulunamadı." });
    }

    res.json({
      success: 1,
      data: notice,
      message: "İlan detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createNotice = async (req, res, next) => {
  try {
    const { title, content, status, department_id, decision_id } = req.body;
    const allowedStatuses = ["on_hold", "completed", "upcoming"];
    if (status && !allowedStatuses.includes(status)) {
      if (req.file) fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: 0,
        data: null,
        message:
          "Geçersiz durum (status) değeri. Beklenen: on_hold, completed veya upcoming",
      });
    }
    const uploadedFile =
      req.file || (req.files && Object.values(req.files).flat()[0]);
    const file_url = uploadedFile
      ? uploadedFile.path.replace(/\\/g, "/")
      : null;
    const newNotice = await PublicNotice.create({
      title,
      content,
      status: status || "on_hold",
      file_url: file_url || null,
      department_id,
      decision_id: decision_id || null,
    });

    res.status(201).json({
      success: 1,
      data: newNotice,
      message: "Duyuru başarıyla oluşturuldu.",
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
exports.updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await PublicNotice.findByPk(id);
    const { title, content, status, department_id, decision_id } = req.body;
    const allowedStatuses = ["on_hold", "completed", "upcoming"];
    if (status && !allowedStatuses.includes(status)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: 0,
        data: null,
        message:
          "Geçersiz durum (status) değeri. Beklenen: on_hold, completed veya upcoming",
      });
    }

    if (!notice) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İlan bulunamadı." });
    }

    let file_url = notice.file_url;

    if (req.file) {
      if (notice.file_url && fs.existsSync(notice.file_url)) {
        fs.unlinkSync(notice.file_url);
      }
      file_url = req.file.path.replace(/\\/g, "/");
    }
    await notice.update({
      title: title ?? notice.title,
      content: content ?? notice.content,
      status: status ?? notice.status,
      file_url: file_url ?? notice.file_url,
      department_id: department_id ?? notice.department_id,
      decision_id: decision_id ?? notice.decision_id,
    });

    return res.json({
      success: 1,
      data: notice,
      message: "İlan bilgisi güncellendi.",
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

//Delete
exports.deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notice = await PublicNotice.findByPk(id);
    if (!notice) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "İlan bulunamadı." });
    }
    const fileToDelete = notice.file_url;

    await notice.destroy();

    if (fileToDelete && fs.existsSync(fileToDelete)) {
      fs.unlinkSync(fileToDelete);
    }

    res.json({
      success: 1,
      data: null,
      message: "İlan ve bağlı dosyası silindi.",
    });
  } catch (err) {
    next(err);
  }
};
