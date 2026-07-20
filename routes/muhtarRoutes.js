const express = require("express");
const router = express.Router();
const muhtarController = require("../controllers/muhtarController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, reorderIdsBody } = require("../validators/commonValidator");
const {
  muhtarCreateValidation,
  muhtarUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, muhtarController.getAllMuhtars);
router.get("/:id", idParam(), muhtarController.getMuhtarById);
router.patch(
  "/reorder",
  protect,
  authorize("muhtars", "update"),
  reorderIdsBody,
  muhtarController.reorderMuhtars,
);
router.post(
  "/",
  protect,
  authorize("muhtars"),
  upload.single("image"),
  muhtarCreateValidation,
  muhtarController.createMuhtar,
);
router.put(
  "/:id",
  protect,
  authorize("muhtars"),
  idParam(),
  upload.single("image"),
  muhtarUpdateValidation,
  muhtarController.updateMuhtar,
);
router.delete(
  "/:id",
  protect,
  authorize("muhtars"),
  idParam(),
  muhtarController.deleteMuhtar,
);

module.exports = router;
