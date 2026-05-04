const express = require("express");
const router = express.Router();
const councilMemberController = require("../controllers/councilMemberController");
const upload = require("../middlewares/upload");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", councilMemberController.getAllCouncilMembers);
router.post(
  "/",
  protect,
  authorize("council-member"),
  upload.single("image"),
  councilMemberController.addMemberToCouncil,
);
router.put(
  "/:id",
  upload.single("image"),
  protect,
  authorize("council-member"),
  councilMemberController.updateMember,
);
router.delete(
  "/:id",
  protect,
  authorize("council-member"),
  councilMemberController.deleteMember,
);

module.exports = router;
