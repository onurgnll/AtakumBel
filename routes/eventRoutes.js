const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/", protect, authorize("events"), eventController.createEvent);
router.put("/:id", protect, authorize("events"), eventController.updateEvent);
router.delete(
  "/:id",
  protect,
  authorize("events"),
  eventController.deleteEvent,
);

module.exports = router;
