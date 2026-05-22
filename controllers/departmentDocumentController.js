const { DepartmentDocument, Department } = require("../models");
const buildDocumentCategoryController = require("./documentCategoryControllerFactory");

module.exports = buildDocumentCategoryController(
  DepartmentDocument,
  {
    listMessage: "Müdürlük evrakları listelendi.",
    createMessage: "Müdürlük evrağı oluşturuldu.",
    updateMessage: "Müdürlük evrağı güncellendi.",
    deleteMessage: "Müdürlük evrağı silindi.",
    notFoundMessage: "Müdürlük evrağı bulunamadı.",
  },
  {
    foreignKey: "department_id",
    foreignKeyRequired: true,
    publicActiveOnly: true,
    include: [
      {
        model: Department,
        as: "department",
        attributes: ["id", "name"],
      },
    ],
  },
);
