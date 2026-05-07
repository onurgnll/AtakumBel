const express = require("express");
const router = express.Router();
const suggestionController = require("../controllers/suggestionController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");

router.get(
  "/",
  protect,
  authorize("suggestions"),
  paginationQuery,
  suggestionController.getAllSuggestions,
);
router.post("/", requireBody, suggestionController.createSuggestion);
router.put(
  "/:id",
  protect,
  authorize("suggestions"),
  idParam(),
  requireBody,
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
