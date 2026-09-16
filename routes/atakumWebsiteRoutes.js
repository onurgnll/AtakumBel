const express = require("express");
const router = express.Router();
const atakumWebsiteController = require("../controllers/atakumWebsiteController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, reorderIdsBody } = require("../validators/commonValidator");
const {
  atakumWebsiteCreateValidation,
  atakumWebsiteUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, atakumWebsiteController.getAllAtakumWebsites);
router.get("/:id", idParam(), atakumWebsiteController.getAtakumWebsiteById);
router.patch(
  "/reorder",
  protect,
  authorize("atakumWebsites", "update"),
  reorderIdsBody,
  atakumWebsiteController.reorderAtakumWebsites,
);
router.post(
  "/",
  protect,
  authorize("atakumWebsites"),
  atakumWebsiteCreateValidation,
  atakumWebsiteController.createAtakumWebsite,
);
router.put(
  "/:id",
  protect,
  authorize("atakumWebsites"),
  idParam(),
  atakumWebsiteUpdateValidation,
  atakumWebsiteController.updateAtakumWebsite,
);
router.delete(
  "/:id",
  protect,
  authorize("atakumWebsites"),
  idParam(),
  atakumWebsiteController.deleteAtakumWebsite,
);

module.exports = router;
