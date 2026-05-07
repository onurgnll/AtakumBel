const { AuditReport } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(AuditReport, {
  listMessage: "Denetim raporları listelendi.",
  createMessage: "Denetim raporu oluşturuldu.",
  updateMessage: "Denetim raporu güncellendi.",
  deleteMessage: "Denetim raporu silindi.",
  notFoundMessage: "Denetim raporu bulunamadı.",
});

