const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const editorImageController = require("../controllers/editorImageController");

router.post(
  "/",
  protect,
  upload.single("image"),
  editorImageController.uploadEditorImage,
);

module.exports = router;
