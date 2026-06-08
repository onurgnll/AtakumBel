const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  serviceCreateValidation,
  serviceUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");

router.get("/", listWithSearchQuery, serviceController.getAllServices);
router.get("/:id", idParam(), serviceController.getServiceById);
router.post(
  "/",
  protect,
  authorize("services"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  serviceCreateValidation,
  serviceController.createService,
);
router.put(
  "/:id",
  protect,
  authorize("services"),
  idParam(),
  upload.fields([{ name: "image", maxCount: 1 }]),
  serviceUpdateValidation,
  serviceController.updateService,
);
router.delete(
  "/:id",
  protect,
  authorize("services"),
  idParam(),
  serviceController.deleteService,
);

module.exports = router;
