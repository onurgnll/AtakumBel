const express = require("express");
const router = express.Router();
const controller = require("../controllers/performanceProgramController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, controller.getAll);
router.post("/", protect, authorize("performancePrograms"), upload.single("document"), controller.create);
router.put("/:id", protect, authorize("performancePrograms"), idParam(), upload.single("document"), controller.update);
router.delete("/:id", protect, authorize("performancePrograms"), idParam(), controller.remove);

module.exports = router;

