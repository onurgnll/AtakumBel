"use strict";

const express = require("express");
const router = express.Router();
const mobileAppController = require("../controllers/mobileAppController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", mobileAppController.getSetting);
// POST: requestGuard PUT'ta son path segmentinin sayısal id olmasını zorunlu kılar
router.post(
  "/",
  protect,
  authorize("mobileApp", "update"),
  mobileAppController.updateSetting,
);

module.exports = router;
