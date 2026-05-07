const { KvkkDocument } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(KvkkDocument, {
  listMessage: "KVKK dokümanları listelendi.",
  createMessage: "KVKK dokümanı oluşturuldu.",
  updateMessage: "KVKK dokümanı güncellendi.",
  deleteMessage: "KVKK dokümanı silindi.",
  notFoundMessage: "KVKK dokümanı bulunamadı.",
});

