const { ActivityReport } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(ActivityReport, {
  listMessage: "Faaliyet raporları listelendi.",
  createMessage: "Faaliyet raporu oluşturuldu.",
  updateMessage: "Faaliyet raporu güncellendi.",
  deleteMessage: "Faaliyet raporu silindi.",
  notFoundMessage: "Faaliyet raporu bulunamadı.",
});

