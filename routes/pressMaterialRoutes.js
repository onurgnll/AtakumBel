const express = require("express");
const router = express.Router();
const pressMaterialController = require("../controllers/pressMaterialController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", pressMaterialController.getAllPressMaterials);
router.post(
  "/",
  protect,
  authorize("pressMaterials"),
  upload.array("document"),
  pressMaterialController.createPressMaterial,
);
router.put(
  "/:id",
  protect,
  authorize("pressMaterials"),
  upload.single("document"),
  pressMaterialController.updatePressMaterial,
);
router.delete(
  "/:id",
  protect,
  authorize("pressMaterials"),
  pressMaterialController.deletePressMaterial,
);

module.exports = router;
