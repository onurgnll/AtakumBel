"use strict";

const express = require("express");
const router = express.Router();
const freeWifiPointController = require("../controllers/freeWifiPointController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  mapPointCreateValidation,
  mapPointUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", paginationQuery, freeWifiPointController.getAllFreeWifiPoints);
router.get("/:id", idParam(), freeWifiPointController.getFreeWifiPointById);
router.post(
  "/",
  protect,
  authorize("mapPoints"),
  mapPointCreateValidation,
  freeWifiPointController.createFreeWifiPoint,
);
router.put(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  mapPointUpdateValidation,
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
