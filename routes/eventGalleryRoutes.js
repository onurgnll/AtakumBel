const express = require("express");
const router = express.Router();
const eventGalleryController = require("../controllers/eventGalleryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/:event_id", protect, authorize("events", "read"), eventGalleryController.getGalleryByEventId);
router.post(
  "/:event_id",
  protect,
  authorize("events"),
  upload.array("image", 10),
  eventGalleryController.addImageToGallery,
);
router.delete(
  "/:id",
  protect,
  authorize("events"),
  eventGalleryController.deleteGalleryImage,
);
router.put(
  "/:id",
  protect,
  authorize("events"),
  eventGalleryController.setMainImage,
);

module.exports = router;
