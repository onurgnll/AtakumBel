const express = require("express");
const router = express.Router();
const photoGalleryController = require("../controllers/photoGalleryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const upload = require("../middlewares/upload");

router.get("/", paginationQuery, photoGalleryController.getAllPhotos);
// router.get("/", protect, authorize("photoGallery", "read"), paginationQuery, photoGalleryController.getAllPhotos);
router.post(
  "/",
  protect,
  authorize("photoGallery"),
  upload.array("images", 30),
  photoGalleryController.createPhotos,
);
router.delete(
  "/:id",
  protect,
  authorize("photoGallery"),
  idParam(),
  photoGalleryController.deletePhoto,
);

module.exports = router;
