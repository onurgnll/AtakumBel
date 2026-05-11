const express = require("express");
const router = express.Router();
const tenderController = require("../controllers/tenderController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, paginationQuery } = require("../validators/commonValidator");
const {
  tenderCreateValidation,
  tenderUpdateValidation,
} = require("../validators/moduleValidators");
const upload = require("../middlewares/upload");

router.get("/", paginationQuery, tenderController.getAllTenders);
router.get("/:id", idParam(), tenderController.getTenderById);
router.post(
  "/",
  protect,
  authorize("tenders"),
  upload.array("file", 25),
  tenderCreateValidation,
  tenderController.createTender,
);
router.put(
  "/:id",
  protect,
  authorize("tenders"),
  idParam(),
  upload.array("file", 25),
  tenderUpdateValidation,
  tenderController.updateTender,
);
router.delete(
  "/:id",
  protect,
  authorize("tenders"),
  idParam(),
  tenderController.deleteTender,
);

module.exports = router;
