const { Tender, PublicNotice } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

//Read
exports.getAllTenders = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { search } = req.query;

    let whereCondition = {};

    if (search) {
      whereCondition.tender_number = { [Op.iLike]: `%${search}%` };
    }

    const { rows: tenders, count } = await Tender.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: PublicNotice,
          as: "notice",
          attributes: ["id", "title", "content"],
        },
      ],
      limit,
      offset,
      order: [["start_date", "DESC"]],
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
    const tender = await Tender.findByPk(id, {
      include: [
        {
          model: PublicNotice,
          as: "notice",
        },
      ],
    });
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
    const { notice_id, start_date, end_date, tender_number } = req.body;
    const formatDate = (dateStr) => {
      if (!dateStr || !dateStr.includes(".")) return dateStr;
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(start_date);
    const formattedEndDate = formatDate(end_date);

    if (new Date(formattedStartDate) > new Date(formattedEndDate)) {
      return res.status(400).json({
        success: 0,
        message: "Bitiş tarihi başlangıç tarihinden önce olamaz.",
      });
    }

    if (notice_id) {
      const notice = await PublicNotice.findByPk(notice_id);
      if (!notice) {
        return res.status(404).json({
          success: 0,
          message: "İhale için seçilen ilgili ilan bulunamadı.",
        });
      }
    }
    const existingTender = await Tender.findOne({ where: { tender_number } });
    if (existingTender) {
      return res.status(409).json({
        success: 0,
        data: existingTender,
        message: "Bu ihale numarasıyla zaten bir kayıt mevcut.",
      });
    }
    const newTender = await Tender.create({
      notice_id: notice_id || null,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      tender_number,
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
    const { notice_id, start_date, end_date, tender_number } = req.body;

    const tender = await Tender.findByPk(id);
    if (!tender) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek ihale bulunamadı.",
      });
    }

    const formatDate = (dateStr) => {
      if (!dateStr || !dateStr.includes(".")) return dateStr;
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    };

    const finalStartDate = start_date
      ? formatDate(start_date)
      : tender.start_date;
    const finalEndDate = end_date ? formatDate(end_date) : tender.end_date;

    if (new Date(finalStartDate) > new Date(finalEndDate)) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Bitiş tarihi başlangıç tarihinden önce olamaz.",
      });
    }

    await tender.update({
      notice_id: notice_id ?? tender.notice_id,
      start_date: finalStartDate,
      end_date: finalEndDate,
      tender_number: tender_number ?? tender.tender_number,
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

    await tender.destroy();
    res.json({ success: 1, data: null, message: "İhale kaydı silindi." });
  } catch (err) {
    next(err);
  }
};
