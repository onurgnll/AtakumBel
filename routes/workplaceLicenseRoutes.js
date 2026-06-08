const express = require("express");
const router = express.Router();
const controller = require("../controllers/workplaceLicenseController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { contentWithAttachmentsUpload } = require("../middlewares/upload");
const { workplaceLicenseUpsertValidation } = require("../validators/moduleValidators");

router.get("/", controller.getWorkplaceLicenses);
router.post(
  "/",
  protect,
  authorize("workplaceLicenses"),
  contentWithAttachmentsUpload,
  workplaceLicenseUpsertValidation,
  controller.upsertWorkplaceLicenses,
);

module.exports = router;
