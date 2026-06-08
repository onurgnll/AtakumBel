const express = require("express");
const router = express.Router();
const controller = require("../controllers/activityReportController");
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
  authorize("activityReports"),
  upload.array("document", 25),
  documentCategoryCreateValidation,
  controller.create,
);
router.put(
  "/:id",
  protect,
  authorize("activityReports"),
  idParam(),
  upload.array("document", 25),
  documentCategoryUpdateValidation,
  controller.update,
);
router.delete("/:id", protect, authorize("activityReports"), idParam(), controller.remove);

module.exports = router;
