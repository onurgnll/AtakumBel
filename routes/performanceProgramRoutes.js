const express = require("express");
const router = express.Router();
const controller = require("../controllers/performanceProgramController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  documentCategoryCreateValidation,
  documentCategoryUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", paginationQuery, controller.getAll);
router.post(
  "/",
  protect,
  authorize("performancePrograms"),
  upload.single("document"),
  documentCategoryCreateValidation,
  controller.create,
);
router.put(
  "/:id",
  protect,
  authorize("performancePrograms"),
  idParam(),
  upload.single("document"),
  documentCategoryUpdateValidation,
  controller.update,
);
router.delete("/:id", protect, authorize("performancePrograms"), idParam(), controller.remove);

module.exports = router;
