const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", facilityController.getAllFacilities);
router.get("/:id", facilityController.getFacilityById);
router.post(
  "/",
  protect,
  authorize("facilities"),
  facilityController.createFacility,
);
router.put(
  "/:id",
  protect,
  authorize("facilities"),
  facilityController.updateFacility,
);
router.delete(
  "/:id",
  protect,
  authorize("facilities"),
  facilityController.deleteFacility,
);

module.exports = router;
