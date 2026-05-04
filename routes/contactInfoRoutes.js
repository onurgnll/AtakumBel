const express = require("express");
const router = express.Router();
const contactInfoController = require("../controllers/contactInfoController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", contactInfoController.getAllContactInfos);
router.post(
  "/",
  protect,
  authorize("contactInfos"),
  contactInfoController.createContactInfo,
);
router.put(
  "/:id",
  protect,
  authorize("contactInfos"),
  contactInfoController.updateContactInfo,
);
router.delete(
  "/:id",
  protect,
  authorize("contactInfos"),
  contactInfoController.deleteContactInfo,
);

module.exports = router;
