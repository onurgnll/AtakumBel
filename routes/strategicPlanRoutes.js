const express = require("express");
const router = express.Router();
const controller = require("../controllers/strategicPlanController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { documentUpload } = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  documentCategoryCreateValidation,
  documentCategoryUpdateValidation,
} = require("../validators/moduleValidators");

router.get("/", paginationQuery, controller.getAll);
router.post(
  "/",
  protect,
  authorize("strategicPlans"),
  documentUpload.array("document", 25),
  documentCategoryCreateValidation,
  controller.create,
);
router.put(
  "/:id",
  protect,
  authorize("strategicPlans"),
  idParam(),
  documentUpload.array("document", 25),
  documentCategoryUpdateValidation,
  controller.update,
);
router.delete("/:id", protect, authorize("strategicPlans"), idParam(), controller.remove);

module.exports = router;
