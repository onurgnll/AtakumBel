"use strict";

const express = require("express");
const router = express.Router();
const freeWifiPointController = require("../controllers/freeWifiPointController");

router.get("/", freeWifiPointController.getAllFreeWifiPoints);

module.exports = router;

