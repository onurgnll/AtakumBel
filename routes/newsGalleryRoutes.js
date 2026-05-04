const express = require("express");
const router = express.Router();
const newsGalleryController = require("../controllers/newsGalleryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post(
  "/:news_id",
  protect,
  authorize("news"),
  upload.array("image"),
  newsGalleryController.addImageToGallery,
);
router.put(
  "/:id",
  protect,
  authorize("news"),
  newsGalleryController.setMainImage,
);
router.delete(
  "/:id",
  protect,
  authorize("news"),
  newsGalleryController.deleteGalleryImage,
);

module.exports = router;
