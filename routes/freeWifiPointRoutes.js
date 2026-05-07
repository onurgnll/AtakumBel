"use strict";

const express = require("express");
const router = express.Router();
const freeWifiPointController = require("../controllers/freeWifiPointController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");

router.get("/", paginationQuery, freeWifiPointController.getAllFreeWifiPoints);
router.get("/:id", idParam(), freeWifiPointController.getFreeWifiPointById);
router.post(
  "/",
  protect,
  authorize("mapPoints"),
  requireBody,
  freeWifiPointController.createFreeWifiPoint,
);
router.put(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  requireBody,
  freeWifiPointController.updateFreeWifiPoint,
);
router.delete(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  freeWifiPointController.deleteFreeWifiPoint,
);

module.exports = router;

