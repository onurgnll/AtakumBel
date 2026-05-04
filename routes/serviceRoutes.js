const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", serviceController.getAllServices);
router.post(
  "/",
  protect,
  authorize("services"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  serviceController.createService,
);
router.put(
  "/:id",
  protect,
  authorize("services"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  serviceController.updateService,
);
router.delete(
  "/:id",
  protect,
  authorize("services"),
  serviceController.deleteService,
);

module.exports = router;
