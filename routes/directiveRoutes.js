const express = require("express");
const router = express.Router();
const directiveController = require("../controllers/directiveController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  directiveCreateValidation,
  directiveUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, directiveController.getAllDirectives);
router.get("/:id", idParam(), directiveController.getDirectiveById);
router.post(
  "/",
  protect,
  authorize("directives"),
  directiveCreateValidation,
  directiveController.createDirective,
);
router.put(
  "/:id",
  protect,
  authorize("directives"),
  idParam(),
  directiveUpdateValidation,
  directiveController.updateDirective,
);
router.delete(
  "/:id",
  protect,
  authorize("directives"),
  idParam(),
  directiveController.deleteDirective,
);

module.exports = router;
