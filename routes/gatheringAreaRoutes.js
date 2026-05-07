"use strict";

const express = require("express");
const router = express.Router();
const gatheringAreaController = require("../controllers/gatheringAreaController");

router.get("/", gatheringAreaController.getAllGatheringAreas);

module.exports = router;

