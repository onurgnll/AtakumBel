const express = require("express");
const router = express.Router();
const presidentController = require("../controllers/presidentController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { presidentUpsertValidation } = require("../validators/moduleValidators");

router.get("/", presidentController.getPresident);
router.get("/message", presidentController.getPresidentMessage);

router.post(
  "/",
  protect,
  authorize("presidents"),
  upload.single("image"),
  presidentUpsertValidation,
  presidentController.upsertPresident,
);

module.exports = router;
