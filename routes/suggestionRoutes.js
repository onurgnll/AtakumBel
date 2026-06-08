const express = require("express");
const router = express.Router();
const suggestionController = require("../controllers/suggestionController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  suggestionCreateValidation,
  suggestionStatusUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get(
  "/",
  protect,
  authorize("suggestions"),
  listWithSearchQuery,
  suggestionController.getAllSuggestions,
);
router.post("/", suggestionCreateValidation, suggestionController.createSuggestion);
router.put(
  "/:id",
  protect,
  authorize("suggestions"),
  idParam(),
  suggestionStatusUpdateValidation,
  suggestionController.updateSuggestionStatus,
);
router.delete(
  "/:id",
  protect,
  authorize("suggestions"),
  idParam(),
  suggestionController.deleteSuggestion,
);

module.exports = router;
