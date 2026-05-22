const express = require("express");
const router = express.Router();
const councilMemberController = require("../controllers/councilMemberController");
const upload = require("../middlewares/upload");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery, reorderIdsBody } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");

router.get("/", paginationQuery, councilMemberController.getAllCouncilMembers);
router.patch(
  "/reorder",
  protect,
  authorize("councilMembers", "update"),
  reorderIdsBody,
  councilMemberController.reorderCouncilMembers,
);
router.post(
  "/",
  protect,
  authorize("councilMembers"),
  upload.single("image"),
  requireBody,
  councilMemberController.addMemberToCouncil,
);
router.put(
  "/:id",
  protect,
  authorize("councilMembers"),
  idParam(),
  upload.single("image"),
  requireBody,
  councilMemberController.updateMember,
);
router.delete(
  "/:id",
  protect,
  authorize("councilMembers"),
  idParam(),
  councilMemberController.deleteMember,
);

module.exports = router;
