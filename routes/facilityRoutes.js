const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam } = require("../validators/commonValidator");
const {
  facilityCreateValidation,
  facilityUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");

router.get("/", listWithSearchQuery, facilityController.getAllFacilities);
router.get("/:id", idParam(), facilityController.getFacilityById);
router.post(
  "/",
  protect,
  authorize("facilities"),
  upload.array("images", 10),
  facilityCreateValidation,
  facilityController.createFacility,
);
router.put(
  "/:id",
  protect,
  authorize("facilities"),
  idParam(),
  upload.array("images", 10),
  facilityUpdateValidation,
  facilityController.updateFacility,
);
router.delete(
  "/:id",
  protect,
  authorize("facilities"),
  idParam(),
  facilityController.deleteFacility,
);

module.exports = router;
