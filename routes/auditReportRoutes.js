const express = require("express");
const router = express.Router();
const controller = require("../controllers/auditReportController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, controller.getAll);
router.post("/", protect, authorize("auditReports"), upload.single("document"), controller.create);
router.put("/:id", protect, authorize("auditReports"), idParam(), upload.single("document"), controller.update);
router.delete("/:id", protect, authorize("auditReports"), idParam(), controller.remove);

module.exports = router;

