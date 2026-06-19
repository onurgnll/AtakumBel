const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizePublication } = require("../middlewares/authorizePublication");
const upload = require("../middlewares/upload");
const { idParam, handleValidation } = require("../validators/commonValidator");
const {
  publicationCreateValidation,
  publicationUpdateValidation,
} = require("../validators/moduleValidators");
const { query } = require("express-validator");

const publicationUpload = upload.fields([
  { name: "files", maxCount: 25 },
  { name: "file", maxCount: 25 },
]);

const publicationListQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sayfa numarası 1 veya daha büyük olmalıdır."),
  query("per_page")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("Sayfa başına kayıt sayısı 1-500 aralığında olmalıdır."),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Arama metni en fazla 200 karakter olabilir."),
  query("record_type").optional().isString().withMessage("Kayıt türü metin olmalıdır."),
  query("is_active")
    .optional()
    .isIn(["true", "false", "1", "0"])
    .withMessage("Aktiflik durumu doğru veya yanlış olmalıdır."),
  handleValidation,
];

router.get("/", publicationListQuery, publicationController.getAllPublications);
router.get("/:id", idParam(), publicationController.getPublicationById);

router.post(
  "/",
  protect,
  publicationUpload,
  authorizePublication,
  publicationCreateValidation,
  publicationController.createPublication,
);

router.put(
  "/:id",
  protect,
  idParam(),
  publicationUpload,
  authorizePublication,
  publicationUpdateValidation,
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
