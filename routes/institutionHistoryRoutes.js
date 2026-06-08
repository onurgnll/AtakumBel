const express = require("express");
const router = express.Router();
const controller = require("../controllers/institutionHistoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { institutionHistoryUpsertValidation } = require("../validators/moduleValidators");

router.get("/", controller.getInstitutionHistory);
router.post(
  "/",
  protect,
  authorize("institutionHistory"),
  institutionHistoryUpsertValidation,
  controller.upsertInstitutionHistory,
);

module.exports = router;
