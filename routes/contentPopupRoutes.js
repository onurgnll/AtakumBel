const express = require("express");
const router = express.Router();
const contentPopupController = require("../controllers/contentPopupController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const uploder = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, contentPopupController.getAllContentPopups);
router.get("/:id", idParam(), contentPopupController.getContentPopupById);
router.post(
  "/",
  protect,
  authorize("contentPopups"),
  uploder.single("image"),
  contentPopupController.createContentPopup,
);
router.put(
  "/:id",
  protect,
  authorize("contentPopups"),
  idParam(),
  uploder.single("image"),
  contentPopupController.updateContentPopup,
);
router.delete(
  "/:id",
  protect,
  authorize("contentPopups"),
  idParam(),
  contentPopupController.deleteContentPopup,
);

module.exports = router;
