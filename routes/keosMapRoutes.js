"use strict";

const express = require("express");
const router = express.Router();
const keosMapController = require("../controllers/keosMapController");
const { protect } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/visibility", keosMapController.getVisibility);
// POST: requestGuard PUT'ta son path segmentinin sayısal id olmasını zorunlu kılar
router.post("/visibility", protect, keosMapController.updateVisibility);

router.get(
  "/waste-points",
  paginationQuery,
  keosMapController.getWastePoints,
);
router.get(
  "/waste-points/:id",
  idParam(),
  keosMapController.getWastePointById,
);
router.get(
  "/gathering-areas",
  paginationQuery,
  keosMapController.getGatheringAreas,
);
router.get(
  "/gathering-areas/:id",
  idParam(),
  keosMapController.getGatheringAreaById,
);

module.exports = router;
