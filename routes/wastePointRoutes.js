"use strict";

const express = require("express");
const router = express.Router();
const wastePointController = require("../controllers/wastePointController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");

router.get("/", paginationQuery, wastePointController.getAllWastePoints);
router.get("/:id", idParam(), wastePointController.getWastePointById);
router.post(
  "/",
  protect,
  authorize("mapPoints"),
  requireBody,
  wastePointController.createWastePoint,
);
router.put(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  requireBody,
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

