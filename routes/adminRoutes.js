const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuditLogController = require("../controllers/adminAuditLogController");
const adminDashboardController = require("../controllers/adminDashboardController");
const authController = require("../controllers/authController");
const { protect, authorize, authorizeSuperAdmin } = require("../middlewares/authMiddleware");
const {
  loginValidation,
  completeTotpSetupValidation,
  verifyLoginTotpValidation,
  adminRegisterValidation,
  adminUpdateValidation,
} = require("../validators/moduleValidators");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.post(
  "/login/complete-totp-setup",
  completeTotpSetupValidation,
  authController.completeTotpSetup,
);
router.post("/login/verify-totp", verifyLoginTotpValidation, authController.verifyLoginTotp);
router.post("/login", loginValidation, authController.login);

router.use(protect);

router.get("/me", adminController.getMe);
router.get("/dashboard/system", adminDashboardController.getSystemInfo);
router.get("/dashboard/activity", adminDashboardController.getActivity);
router.get(
  "/audit-logs",
  authorize("adminAuditLogs", "read"),
  paginationQuery,
  adminAuditLogController.getAll,
);
router.get("/", authorize("admins", "read"), paginationQuery, adminController.getAllAdmins);
router.post("/register", authorizeSuperAdmin, adminRegisterValidation, authController.register);
router.put("/:id", authorizeSuperAdmin, idParam(), adminUpdateValidation, adminController.updateAdmin);
router.delete("/:id", authorizeSuperAdmin, idParam(), adminController.deleteAdmin);

module.exports = router;
