const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const upload = require("../middlewares/upload");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  employeeCreateValidation,
  employeeUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, employeeController.getAllEmployees);
router.post(
  "/",
  protect,
  authorize("employees"),
  upload.single("image"),
  employeeCreateValidation,
  employeeController.createEmployee,
);
router.put(
  "/:id",
  protect,
  authorize("employees"),
  idParam(),
  upload.single("image"),
  employeeUpdateValidation,
  employeeController.updateEmployee,
);
router.delete(
  "/:id",
  protect,
  authorize("employees"),
  idParam(),
  employeeController.deleteEmployee,
);

module.exports = router;
