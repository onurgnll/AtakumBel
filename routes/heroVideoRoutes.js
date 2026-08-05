"use strict";

const express = require("express");
const router = express.Router();
const heroVideoController = require("../controllers/heroVideoController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", heroVideoController.getSetting);
// POST: requestGuard PUT'ta son path segmentinin sayısal id olmasını zorunlu kılar
router.post("/", protect, heroVideoController.updateSetting);

module.exports = router;
