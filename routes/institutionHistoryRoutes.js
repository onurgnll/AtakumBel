const express = require("express");
const router = express.Router();
const controller = require("../controllers/institutionHistoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", controller.getInstitutionHistory);
router.post("/", protect, authorize("institutionHistory"), controller.upsertInstitutionHistory);

module.exports = router;
