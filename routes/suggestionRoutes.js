const express = require("express");
const router = express.Router();
const suggestionController = require("../controllers/suggestionController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get(
  "/",
  protect,
  authorize("suggestions"),
  suggestionController.getAllSuggestions,
);
router.post("/", suggestionController.createSuggestion);
router.put(
  "/:id",
  protect,
  authorize("suggestions"),
  suggestionController.updateSuggestionStatus,
);
router.delete(
  "/:id",
  protect,
  authorize("suggestions"),
  suggestionController.deleteSuggestion,
);

module.exports = router;
