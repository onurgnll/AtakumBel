"use strict";

const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  marketplaceCreateValidation,
  marketplaceUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", paginationQuery, marketplaceController.getAllMarketplaces);
router.get("/:id", idParam(), marketplaceController.getMarketplaceById);
router.post(
  "/",
  protect,
  authorize("mapPoints"),
  marketplaceCreateValidation,
  marketplaceController.createMarketplace,
);
router.put(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  marketplaceUpdateValidation,
  marketplaceController.updateMarketplace,
);
router.delete(
  "/:id",
  protect,
  authorize("mapPoints"),
  idParam(),
  marketplaceController.deleteMarketplace,
);

module.exports = router;
