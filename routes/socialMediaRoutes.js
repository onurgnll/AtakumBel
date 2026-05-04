const express = require("express");
const router = express.Router();
const socialMediaController = require("../controllers/socialMediaController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", socialMediaController.getAllSocialMedia);
router.post(
  "/",
  protect,
  authorize("socialMedia"),
  socialMediaController.createSocialMedia,
);
router.put(
  "/:id",
  protect,
  authorize("socialMedia"),
  socialMediaController.updateSocialMedia,
);
router.delete(
  "/:id",
  protect,
  authorize("socialMedia"),
  socialMediaController.deleteSocialMedia,
);

module.exports = router;
