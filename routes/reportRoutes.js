const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", reportController.getAllReports);
router.post(
  "/",
  protect,
  authorize("reports"),
  upload.single("document"),
  reportController.createReport,
);
router.put(
  "/:id",
  protect,
  authorize("reports"),
  upload.single("document"),
  reportController.updateReport,
);
router.delete(
  "/:id",
  protect,
  authorize("reports"),
  reportController.deleteReport,
);

module.exports = router;
