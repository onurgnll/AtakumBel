const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const { protect, authorize, authorizeSuperAdmin } = require("../middlewares/authMiddleware");
const {
  loginValidation,
  adminRegisterValidation,
  adminUpdateValidation,
} = require("../validators/moduleValidators");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.post("/login", loginValidation, authController.login);

router.use(protect);

router.get("/", authorize("admins", "read"), paginationQuery, adminController.getAllAdmins);
router.post("/register", authorizeSuperAdmin, adminRegisterValidation, authController.register);
router.put("/:id", authorizeSuperAdmin, idParam(), adminUpdateValidation, adminController.updateAdmin);
router.delete("/:id", authorizeSuperAdmin, idParam(), adminController.deleteAdmin);

module.exports = router;
