const express = require("express");
const router = express.Router();
const vicePresidentController = require("../controllers/vicePresidentController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", vicePresidentController.getAllVicePresidents);
router.post(
  "/",
  protect,
  authorize("vicePresidents"),
  upload.single("image"),
  vicePresidentController.createVicePresident,
);
router.put(
  "/:id",
  protect,
  authorize("vicePresidents"),
  upload.single("image"),
  vicePresidentController.updateVicePresident,
);
router.delete(
  "/:id",
  protect,
  authorize("vicePresidents"),
  vicePresidentController.deleteVicePresident,
);

module.exports = router;
