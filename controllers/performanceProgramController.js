const { PerformanceProgram } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(PerformanceProgram, {
  listMessage: "Performans programları listelendi.",
  createMessage: "Performans programı oluşturuldu.",
  updateMessage: "Performans programı güncellendi.",
  deleteMessage: "Performans programı silindi.",
  notFoundMessage: "Performans programı bulunamadı.",
});

