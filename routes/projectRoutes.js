const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.post(
  "/",
  protect,
  authorize("projects"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  projectController.createProject,
);
router.put(
  "/:id",
  protect,
  authorize("projects"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  projectController.updateProject,
);
router.delete(
  "/:id",
  protect,
  authorize("projects"),
  projectController.deleteProject,
);

module.exports = router;
