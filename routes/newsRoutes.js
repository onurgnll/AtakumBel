const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const { requireBody } = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");
const contentUpload = upload.contentWithAttachmentsUpload;

router.get("/", paginationQuery, newsController.getAllNews);
router.get("/:id", idParam(), newsController.getNewsById);
router.post("/", protect, authorize("news"), contentUpload, requireBody, newsController.createNews);
router.put("/:id", protect, authorize("news"), idParam(), contentUpload, newsController.updateNews);
router.delete("/:id", protect, authorize("news"), idParam(), newsController.deleteNews);

module.exports = router;
