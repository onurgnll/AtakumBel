const express = require("express");
const router = express.Router();
const controller = require("../controllers/financialExpectationReportController");
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
  authorize("financialExpectationReports"),
  upload.array("document", 25),
  documentCategoryCreateValidation,
  controller.create,
);
router.put(
  "/:id",
  protect,
  authorize("financialExpectationReports"),
  idParam(),
  upload.array("document", 25),
  documentCategoryUpdateValidation,
  controller.update,
);
router.delete(
  "/:id",
  protect,
  authorize("financialExpectationReports"),
  idParam(),
  controller.remove,
);

module.exports = router;
