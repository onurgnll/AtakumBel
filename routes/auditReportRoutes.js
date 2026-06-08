const express = require("express");
const router = express.Router();
const controller = require("../controllers/auditReportController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  documentCategoryCreateValidation,
  documentCategoryUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", paginationQuery, controller.getAll);
router.post(
  "/",
  protect,
  authorize("auditReports"),
  upload.array("document", 25),
  documentCategoryCreateValidation,
  controller.create,
);
router.put(
  "/:id",
  protect,
  authorize("auditReports"),
  idParam(),
  upload.array("document", 25),
  documentCategoryUpdateValidation,
  controller.update,
);
router.delete("/:id", protect, authorize("auditReports"), idParam(), controller.remove);

module.exports = router;
