const multer = require("multer");
const path = require("path");
const fs = require("fs");

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024;
const MAX_FIELD_SIZE_BYTES = 25 * 1024 * 1024;

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

const multerLimits = {
  fileSize: MAX_FILE_SIZE_BYTES,
  fieldSize: MAX_FIELD_SIZE_BYTES,
};

const upload = multer({
  storage: storage,
  limits: multerLimits,
  fileFilter: documentFileFilter,
});

const documentUpload = multer({
  storage: storage,
  limits: multerLimits,
  fileFilter: documentFileFilter,
});

const CONTENT_MAX_IMAGES = 25;

const contentUpload = multer({
  storage: storage,
  limits: multerLimits,
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
module.exports.MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
