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
  upload.single("file"),
  realEstateListingController.createRealEstateListing,
);
router.put(
  "/:id",
  protect,
  authorize("realEstateListings"),
  idParam(),
  upload.single("file"),
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

