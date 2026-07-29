const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { idParam, reorderIdsBody } = require("../validators/commonValidator");
const {
  faqCreateValidation,
  faqUpdateValidation,
  listWithSearchQuery,
} = require("../validators/moduleValidators");

router.get("/", listWithSearchQuery, faqController.getAllFaqs);
router.get("/:id", idParam(), faqController.getFaqById);
router.patch(
  "/reorder",
  protect,
  authorize("faqs", "update"),
  reorderIdsBody,
  faqController.reorderFaqs,
);
router.post(
  "/",
  protect,
  authorize("faqs"),
  faqCreateValidation,
  faqController.createFaq,
);
router.put(
  "/:id",
  protect,
  authorize("faqs"),
  idParam(),
  faqUpdateValidation,
  faqController.updateFaq,
);
router.delete(
  "/:id",
  protect,
  authorize("faqs"),
  idParam(),
  faqController.deleteFaq,
);

module.exports = router;
