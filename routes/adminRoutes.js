const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/login", authController.login);

router.use(protect);

router.get("/", adminController.getAllAdmins);
router.post("/register", protect, authController.register);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
