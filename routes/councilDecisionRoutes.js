const express = require("express");
const router = express.Router();
const councilDecisionController = require("../controllers/councilDecisionController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", councilDecisionController.getAllDecisions);
router.post(
  "/",
  protect,
  authorize("councilDecisions"),
  upload.array("file", 25),
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
  upload.array("file", 25),
  councilDecisionController.updateDecision,
);

module.exports = router;
