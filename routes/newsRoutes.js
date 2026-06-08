const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  newsCreateValidation,
  newsUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");
const contentUpload = upload.contentWithAttachmentsUpload;

router.get("/", listWithSearchQuery, newsController.getAllNews);
router.get("/:id", idParam(), newsController.getNewsById);
router.post(
  "/",
  protect,
  authorize("news"),
  contentUpload,
  newsCreateValidation,
  newsController.createNews,
);
router.put(
  "/:id",
  protect,
  authorize("news"),
  idParam(),
  contentUpload,
  newsUpdateValidation,
  newsController.updateNews,
);
router.delete("/:id", protect, authorize("news"), idParam(), newsController.deleteNews);

module.exports = router;
