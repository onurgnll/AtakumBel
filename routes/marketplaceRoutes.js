"use strict";

const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");

router.get("/", marketplaceController.getAllMarketplaces);

module.exports = router;

