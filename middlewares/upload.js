const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.baseUrl.split("/").pop() || "general";
    let uploadPath = `public/uploads/${folderName}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const documentFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Desteklenmeyen dosya formatı! Sadece resim, PDF ve Word yüklenebilir.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB uploaded file limit
    fieldSize: 25 * 1024 * 1024, // allow large rich-text HTML (base64 images)
  },
  fileFilter: documentFileFilter,
});

const documentUpload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB — belge kategorileri
    fieldSize: 25 * 1024 * 1024,
  },
  fileFilter: documentFileFilter,
});

const CONTENT_MAX_IMAGES = 25;

const contentUpload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB — haber, etkinlik, basın bülteni vb.
    fieldSize: 25 * 1024 * 1024,
  },
  fileFilter: documentFileFilter,
});

const contentWithAttachmentsUpload = contentUpload.fields([
  { name: "images", maxCount: CONTENT_MAX_IMAGES },
  { name: "files", maxCount: 25 },
  { name: "document", maxCount: 25 },
]);

module.exports = upload;
module.exports.documentUpload = documentUpload;
module.exports.contentUpload = contentUpload;
module.exports.contentWithAttachmentsUpload = contentWithAttachmentsUpload;
