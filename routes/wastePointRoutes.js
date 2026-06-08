"use strict";

const express = require("express");
const router = express.Router();
const wastePointController = require("../controllers/wastePointController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  mapPointCreateValidation,
  mapPointUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", paginationQuery, wastePointController.getAllWastePoints);
router.get("/:id", idParam(), wastePointController.getWastePointById);
router.post(
  "/",
  protect,
  authorize("mapPoints"),
  mapPointCreateValidation,
  wastePointController.createWastePoint,
);
router.put(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  mapPointUpdateValidation,
  wastePointController.updateWastePoint,
);
router.delete(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  wastePointController.deleteWastePoint,
);

module.exports = router;
