const express = require("express");
const router = express.Router();
const controller = require("../controllers/activityReportController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, controller.getAll);
router.post("/", protect, authorize("activityReports"), upload.single("document"), controller.create);
router.put("/:id", protect, authorize("activityReports"), idParam(), upload.single("document"), controller.update);
router.delete("/:id", protect, authorize("activityReports"), idParam(), controller.remove);

module.exports = router;

