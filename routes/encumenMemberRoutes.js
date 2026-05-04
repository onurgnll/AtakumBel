const express = require("express");
const router = express.Router();
const encumenMemberController = require("../controllers/encumenMemberController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", encumenMemberController.getEncumenWithMembers);
router.post(
  "/",
  protect,
  authorize("encumen"),
  encumenMemberController.addMemberToEncumen,
);
router.delete(
  "/:id",
  protect,
  authorize("encumen"),
  encumenMemberController.removeMemberFromEncumen,
);

module.exports = router;
