const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizePublication } = require("../middlewares/authorizePublication");
const upload = require("../middlewares/upload");
const { idParam, handleValidation } = require("../validators/commonValidator");
const { requireBody, requireFields } = require("../validators/commonValidator");
const { query } = require("express-validator");

const publicationUpload = upload.fields([
  { name: "files", maxCount: 25 },
  { name: "file", maxCount: 25 },
]);

const publicationListQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page değeri 1 veya daha büyük bir sayı olmalıdır."),
  query("per_page")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("per_page değeri 1-500 aralığında olmalıdır."),
  query("search").optional().isString().withMessage("search metin olmalıdır."),
  query("record_type").optional().isString().withMessage("record_type metin olmalıdır."),
  query("is_active")
    .optional()
    .isIn(["true", "false", "1", "0"])
    .withMessage("is_active true veya false olmalıdır."),
  handleValidation,
];

const publicationCreateValidation = [
  ...requireFields(["title", "record_type"]),
];

router.get("/", publicationListQuery, publicationController.getAllPublications);
router.get("/:id", idParam(), publicationController.getPublicationById);

router.post(
  "/",
  protect,
  authorizePublication,
  publicationUpload,
  publicationCreateValidation,
  publicationController.createPublication,
);

router.put(
  "/:id",
  protect,
  authorizePublication,
  idParam(),
  publicationUpload,
  requireBody,
  publicationController.updatePublication,
);

router.delete(
  "/:id",
  protect,
  authorizePublication,
  idParam(),
  publicationController.deletePublication,
);

module.exports = router;
