const express = require("express");
const router = express.Router();
const controller = require("../controllers/pressReleaseGalleryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get(
  "/:press_release_id",
  protect,
  authorize("pressReleases", "read"),
  controller.getGalleryByPressReleaseId,
);
router.post(
  "/:press_release_id",
  protect,
  authorize("pressReleases"),
  upload.array("image"),
  controller.addImageToGallery,
);
router.put(
  "/:id",
  protect,
  authorize("pressReleases"),
  controller.setMainImage,
);
router.delete(
  "/:id",
  protect,
  authorize("pressReleases"),
  controller.deleteGalleryImage,
);

module.exports = router;
