const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.post("/", protect, authorize("news"), newsController.createNews);
router.put("/:id", protect, authorize("news"), newsController.updateNews);
router.delete("/:id", protect, authorize("news"), newsController.deleteNews);

module.exports = router;
