const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  projectCreateValidation,
  projectUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");

router.get("/", listWithSearchQuery, projectController.getAllProjects);
router.get("/:id", idParam(), projectController.getProjectById);
router.post(
  "/",
  protect,
  authorize("projects"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  projectCreateValidation,
  projectController.createProject,
);
router.put(
  "/:id",
  protect,
  authorize("projects"),
  idParam(),
  upload.fields([{ name: "image", maxCount: 1 }]),
  projectUpdateValidation,
  projectController.updateProject,
);
router.delete(
  "/:id",
  protect,
  authorize("projects"),
  idParam(),
  projectController.deleteProject,
);

module.exports = router;
