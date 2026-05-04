const express = require("express");
const router = express.Router();
const facilityGalleryController = require("../controllers/facilityGalleryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post(
  "/:facility_id",
  protect,
  authorize("facilities"),
  upload.array("image", 10),
  facilityGalleryController.addImageToGallery,
);
router.delete(
  "/:id",
  protect,
  authorize("facilities"),
  facilityGalleryController.deleteGalleryImage,
);
router.put(
  "/:id",
  protect,
  authorize("facilities"),
  facilityGalleryController.setMainImage,
);

module.exports = router;
