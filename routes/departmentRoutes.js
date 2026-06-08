const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, reorderIdsBody } = require("../validators/commonValidator");
const {
  departmentCreateValidation,
  departmentUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, departmentController.getAllDepartments);
router.patch(
  "/reorder",
  protect,
  authorize("departments", "update"),
  reorderIdsBody,
  departmentController.reorderDepartments,
);
router.get("/:id", idParam(), departmentController.getDepartmentById);
router.post(
  "/",
  protect,
  authorize("departments"),
  departmentCreateValidation,
  departmentController.createDepartment,
);
router.delete(
  "/:id",
  protect,
  authorize("departments"),
  idParam(),
  departmentController.deleteDepartment,
);
router.put(
  "/:id",
  protect,
  authorize("departments"),
  idParam(),
  departmentUpdateValidation,
  departmentController.updateDepartment,
);

module.exports = router;
