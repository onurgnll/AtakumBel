const express = require("express");
const router = express.Router();
const controller = require("../controllers/pressReleaseController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  pressReleaseCreateValidation,
  pressReleaseUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");
const contentUpload = upload.contentWithAttachmentsUpload;

router.get("/", listWithSearchQuery, controller.getAllPressReleases);
router.get("/:id", idParam(), controller.getPressReleaseById);
router.post(
  "/",
  protect,
  authorize("pressReleases"),
  contentUpload,
  pressReleaseCreateValidation,
  controller.createPressRelease,
);
router.put(
  "/:id",
  protect,
  authorize("pressReleases"),
  idParam(),
  contentUpload,
  pressReleaseUpdateValidation,
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
