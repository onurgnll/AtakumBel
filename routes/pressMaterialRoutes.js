const express = require("express");
const router = express.Router();
const pressMaterialController = require("../controllers/pressMaterialController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, pressMaterialController.getAllPressMaterials);
router.post(
  "/",
  protect,
  authorize("pressMaterials"),
  upload.array("documents", 25),
  pressMaterialController.createPressMaterial,
);
router.put(
  "/:id",
  protect,
  authorize("pressMaterials"),
  idParam(),
  upload.array("documents", 25),
  pressMaterialController.updatePressMaterial,
);
router.delete(
  "/:id",
  protect,
  authorize("pressMaterials"),
  idParam(),
  pressMaterialController.deletePressMaterial,
);

module.exports = router;
