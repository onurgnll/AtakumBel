const express = require("express");
const router = express.Router();
const bankAccountController = require("../controllers/bankAccountController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", bankAccountController.getAllBankAccounts);

router.post(
  "/",
  protect,
  authorize("bankAccounts"),
  bankAccountController.createBankAccount,
);
router.put(
  "/:id",
  protect,
  authorize("bankAccounts"),
  bankAccountController.updateBankAccount,
);
router.delete(
  "/:id",
  protect,
  authorize("bankAccounts"),
  bankAccountController.deleteBankAccount,
);

module.exports = router;
