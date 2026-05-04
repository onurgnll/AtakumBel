const express = require("express");
const router = express.Router();
const encumenController = require("../controllers/encumenController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", encumenController.getAllEncumens);
router.post(
  "/",
  protect,
  authorize("encumen"),
  encumenController.createEncumen,
);

router.put(
  "/:id",
  protect,
  authorize("encumen"),
  encumenController.updateEncumen,
);

router.delete(
  "/:id",
  protect,
  authorize("encumen"),
  encumenController.deleteEncumen,
);

module.exports = router;
