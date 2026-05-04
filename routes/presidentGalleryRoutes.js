const express = require("express");
const router = express.Router();
const presidentGalleryController = require("../controllers/presidentGalleryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/:president_id", presidentGalleryController.getPresidentGallery);
router.post(
  "/:president_id",
  protect,
  authorize("presidents"),
  upload.array("image"),
  presidentGalleryController.addImagesToPresidentGallery,
);

router.put(
  "/:id",
  protect,
  authorize("presidents"),
  presidentGalleryController.setMainImage,
);

router.delete(
  "/:id",
  protect,
  authorize("presidents"),
  presidentGalleryController.deletePresidentGalleryImage,
);

module.exports = router;
