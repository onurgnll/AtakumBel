const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  eventCreateValidation,
  eventUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");
const contentUpload = upload.contentWithAttachmentsUpload;

router.get("/", listWithSearchQuery, eventController.getAllEvents);
router.get("/:id", idParam(), eventController.getEventById);
router.post(
  "/",
  protect,
  authorize("events"),
  contentUpload,
  eventCreateValidation,
  eventController.createEvent,
);
router.put(
  "/:id",
  protect,
  authorize("events"),
  idParam(),
  contentUpload,
  eventUpdateValidation,
  eventController.updateEvent,
);
router.delete(
  "/:id",
  protect,
  authorize("events"),
  idParam(),
  eventController.deleteEvent,
);

module.exports = router;
