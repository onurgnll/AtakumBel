const express = require("express");
const router = express.Router();
const controller = require("../controllers/pressReleaseController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");
const contentUpload = upload.contentWithAttachmentsUpload;

router.get("/", paginationQuery, controller.getAllPressReleases);
router.get("/:id", idParam(), controller.getPressReleaseById);
router.post(
  "/",
  protect,
  authorize("pressReleases"),
  contentUpload,
  requireBody,
  controller.createPressRelease,
);
router.put(
  "/:id",
  protect,
  authorize("pressReleases"),
  idParam(),
  contentUpload,
  controller.updatePressRelease,
);
router.delete(
  "/:id",
  protect,
  authorize("pressReleases"),
  idParam(),
  controller.deletePressRelease,
);

module.exports = router;
