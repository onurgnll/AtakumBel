const express = require("express");
const router = express.Router();
const councilDecisionController = require("../controllers/councilDecisionController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", councilDecisionController.getAllDecisions);
router.post(
  "/",
  protect,
  authorize("councilDecisions"),
  councilDecisionController.createDecision,
);
router.delete(
  "/:id",
  protect,
  authorize("councilDecisions"),
  councilDecisionController.deleteDecision,
);
router.put(
  "/:id",
  protect,
  authorize("councilDecisions"),
  councilDecisionController.updateDecision,
);

module.exports = router;
