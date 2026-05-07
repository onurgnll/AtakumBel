const { StrategicPlan } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(StrategicPlan, {
  listMessage: "Stratejik planlar listelendi.",
  createMessage: "Stratejik plan oluşturuldu.",
  updateMessage: "Stratejik plan güncellendi.",
  deleteMessage: "Stratejik plan silindi.",
  notFoundMessage: "Stratejik plan bulunamadı.",
});

