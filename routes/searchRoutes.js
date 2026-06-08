const express = require("express");
const router = express.Router();

const searchController = require("../controllers/searchController");
const { searchValidation } = require("../validators/moduleValidators");

router.get("/", searchValidation, searchController.searchAll);

module.exports = router;
