const express = require("express");
const router = express.Router();
const tenderController = require("../controllers/tenderController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", tenderController.getAllTenders);
router.get("/:id", tenderController.getTenderById);
router.post("/", protect, authorize("tenders"), tenderController.createTender);
router.put(
  "/:id",
  protect,
  authorize("tenders"),
  tenderController.updateTender,
);
router.delete(
  "/:id",
  protect,
  authorize("tenders"),
  tenderController.deleteTender,
);

module.exports = router;
