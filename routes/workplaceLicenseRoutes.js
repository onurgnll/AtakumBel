const express = require("express");
const router = express.Router();
const controller = require("../controllers/workplaceLicenseController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { contentWithAttachmentsUpload } = require("../middlewares/upload");

router.get("/", controller.getWorkplaceLicenses);
router.post(
  "/",
  protect,
  authorize("workplaceLicenses"),
  contentWithAttachmentsUpload,
  controller.upsertWorkplaceLicenses,
);

module.exports = router;
