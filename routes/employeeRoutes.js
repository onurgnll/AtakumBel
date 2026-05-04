const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const upload = require("../middlewares/upload");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", employeeController.getAllEmployees);
router.post(
  "/",
  protect,
  authorize("employees"),
  upload.single("image"),
  employeeController.createEmployee,
);
router.put(
  "/:id",
  protect,
  authorize("employees"),
  upload.single("image"),
  employeeController.updateEmployee,
);
router.delete(
  "/:id",
  protect,
  authorize("employees"),
  employeeController.deleteEmployee,
);

module.exports = router;
