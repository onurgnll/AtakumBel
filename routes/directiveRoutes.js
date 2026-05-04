const express = require("express");
const router = express.Router();
const directiveController = require("../controllers/directiveController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", directiveController.getAllDirectives);
router.post(
  "/",
  protect,
  authorize("directives"),
  directiveController.createDirective,
);
router.get("/:id", directiveController.getDirectiveById);
router.put(
  "/:id",
  protect,
  authorize("directives"),
  directiveController.updateDirective,
);
router.delete(
  "/:id",
  protect,
  authorize("directives"),
  directiveController.deleteDirective,
);

module.exports = router;
