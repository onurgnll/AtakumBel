const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { reorderIdsBody } = require("../validators/commonValidator");

router.get("/", departmentController.getAllDepartments);
router.patch(
  "/reorder",
  protect,
  authorize("departments", "update"),
  reorderIdsBody,
  departmentController.reorderDepartments,
);
router.get("/:id", departmentController.getDepartmentById);
router.post(
  "/",
  protect,
  authorize("departments"),
  departmentController.createDepartment,
);
router.delete(
  "/:id",
  protect,
  authorize("departments"),
  departmentController.deleteDepartment,
);
router.put(
  "/:id",
  protect,
  authorize("departments"),
  departmentController.updateDepartment,
);

module.exports = router;
