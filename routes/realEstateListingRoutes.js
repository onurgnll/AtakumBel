const express = require("express");
const router = express.Router();
const realEstateListingController = require("../controllers/realEstateListingController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { idParam, paginationQuery } = require("../validators/commonValidator");

router.get("/", paginationQuery, realEstateListingController.getAllRealEstateListings);
router.get("/:id", idParam(), realEstateListingController.getRealEstateListingById);
router.post(
  "/",
  protect,
  authorize("realEstateListings"),
  upload.array("file", 25),
  realEstateListingController.createRealEstateListing,
);
router.put(
  "/:id",
  protect,
  authorize("realEstateListings"),
  idParam(),
  upload.array("file", 25),
  realEstateListingController.updateRealEstateListing,
);
router.delete(
  "/:id",
  protect,
  authorize("realEstateListings"),
  idParam(),
  realEstateListingController.deleteRealEstateListing,
);

module.exports = router;

