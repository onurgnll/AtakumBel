const { Suggestion } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

//Read
exports.getAllSuggestions = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { status } = req.query;
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = status ? { status } : {};
    if (search) {
      whereCondition[Op.or] = [
        { project_name: { [Op.iLike]: `%${search}%` } },
        { project_purpose: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { rows: suggestions, count } = await Suggestion.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    return res.json({
      success: 1,
      data: {
        suggestions,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Proje önerileri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createSuggestion = async (req, res, next) => {
  try {
    const {
      project_name,
      project_purpose,
      application_duration,
      total_budget,
      location,
      stakeholders,
      beneficiaries,
      main_activities,
      expected_results,
    } = req.body;
    const newSuggestion = await Suggestion.create({
      project_name,
      project_purpose,
      application_duration,
      total_budget,
      location,
      stakeholders,
      beneficiaries,
      main_activities,
      expected_results,
      status: "pending",
    });
    return res.status(201).json({
      success: 1,
      data: newSuggestion,
      message: "Yeni proje önerisi oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateSuggestionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: 0,
        message: `Geçersiz durum. Geçerli değerler: beklemede, incelendi, tamamlandı`,
      });
    }
    const suggestion = await Suggestion.findByPk(id);
    if (!suggestion) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek öneri bulunamadı.",
      });
    }
    await suggestion.update({ status });
    return res.json({
      success: 1,
      data: suggestion,
      message: "Öneri durumu güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteSuggestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const suggestion = await Suggestion.findByPk(id);
    if (!suggestion) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek öneri bulunamadı.",
      });
    }
    await suggestion.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Öneri başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
