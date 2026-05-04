const express = require("express");
const router = express.Router();
const councilController = require("../controllers/councilController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", councilController.getAllCouncils);
router.post("", protect, authorize("council"), councilController.createCouncil);
router.put(
  "/:id",
  protect,
  authorize("council"),
  councilController.updateCouncil,
);
router.delete(
  "/:id",
  protect,
  authorize("council"),
  councilController.deleteCouncil,
);

module.exports = router;
