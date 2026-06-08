const express = require("express");
const router = express.Router();
const controller = require("../controllers/departmentDocumentController");
const { protect, optionalProtect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  departmentDocumentCreateValidation,
  departmentDocumentUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", optionalProtect, paginationQuery, controller.getAll);
router.post(
  "/",
  protect,
  authorize("departmentDocuments"),
  upload.array("document", 25),
  departmentDocumentCreateValidation,
  controller.create,
);
router.put(
  "/:id",
  protect,
  authorize("departmentDocuments"),
  idParam(),
  upload.array("document", 25),
  departmentDocumentUpdateValidation,
  controller.update,
);
router.delete(
  "/:id",
  protect,
  authorize("departmentDocuments"),
  idParam(),
  controller.remove,
);

module.exports = router;
