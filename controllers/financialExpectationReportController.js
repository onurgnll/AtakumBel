const { FinancialExpectationReport } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(FinancialExpectationReport, {
  listMessage: "Mali durum beklenti raporları listelendi.",
  createMessage: "Mali durum beklenti raporu oluşturuldu.",
  updateMessage: "Mali durum beklenti raporu güncellendi.",
  deleteMessage: "Mali durum beklenti raporu silindi.",
  notFoundMessage: "Mali durum beklenti raporu bulunamadı.",
});

