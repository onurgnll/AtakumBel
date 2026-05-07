"use strict";

const express = require("express");
const router = express.Router();
const gatheringAreaController = require("../controllers/gatheringAreaController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");

router.get("/", paginationQuery, gatheringAreaController.getAllGatheringAreas);
router.get("/:id", idParam(), gatheringAreaController.getGatheringAreaById);
router.post(
  "/",
  protect,
  authorize("mapPoints"),
  requireBody,
  gatheringAreaController.createGatheringArea,
);
router.put(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  requireBody,
  gatheringAreaController.updateGatheringArea,
);
router.delete(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  gatheringAreaController.deleteGatheringArea,
);

module.exports = router;

