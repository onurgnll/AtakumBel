"use strict";

const express = require("express");
const router = express.Router();
const wastePointController = require("../controllers/wastePointController");

router.get("/", wastePointController.getAllWastePoints);

module.exports = router;

