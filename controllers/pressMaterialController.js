const { PressMaterial } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

const controller = buildDocumentCategoryController(PressMaterial, {
  listMessage: "Basın materyalleri listelendi.",
  createMessage: "Basın materyali oluşturuldu.",
  updateMessage: "Basın materyali güncellendi.",
  deleteMessage: "Basın materyali silindi.",
  notFoundMessage: "Basın materyali bulunamadı.",
});

exports.getAllPressMaterials = controller.getAll;
exports.createPressMaterial = controller.create;
exports.updatePressMaterial = controller.update;
exports.deletePressMaterial = controller.remove;
