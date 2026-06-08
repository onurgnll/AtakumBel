const express = require("express");
const router = express.Router();
const vicePresidentController = require("../controllers/vicePresidentController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, reorderIdsBody } = require("../validators/commonValidator");
const {
  vicePresidentCreateValidation,
  vicePresidentUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, vicePresidentController.getAllVicePresidents);
router.patch(
  "/reorder",
  protect,
  authorize("vicePresidents", "update"),
  reorderIdsBody,
  vicePresidentController.reorderVicePresidents,
);
router.post(
  "/",
  protect,
  authorize("vicePresidents"),
  upload.single("image"),
  vicePresidentCreateValidation,
  vicePresidentController.createVicePresident,
);
router.put(
  "/:id",
  protect,
  authorize("vicePresidents"),
  idParam(),
  upload.single("image"),
  vicePresidentUpdateValidation,
  vicePresidentController.updateVicePresident,
);
router.delete(
  "/:id",
  protect,
  authorize("vicePresidents"),
  idParam(),
  vicePresidentController.deleteVicePresident,
);

module.exports = router;
