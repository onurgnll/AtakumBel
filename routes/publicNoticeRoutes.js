const express = require("express");
const router = express.Router();
const publicNoticeController = require("../controllers/publicNoticeController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const uploder = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, publicNoticeController.getAllNotices);
router.get("/:id", idParam(), publicNoticeController.getNoticeById);
router.post(
  "/",
  protect,
  authorize("publicNotices"),
  uploder.single("file"),
  publicNoticeController.createNotice,
);
router.put(
  "/:id",
  protect,
  authorize("publicNotices"),
  idParam(),
  uploder.single("file"),
  publicNoticeController.updateNotice,
);
router.delete(
  "/:id",
  protect,
  authorize("publicNotices"),
  idParam(),
  publicNoticeController.deleteNotice,
);

module.exports = router;
