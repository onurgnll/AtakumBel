"use strict";

const multer = require("multer");

function translateErrorMessage(err) {
  if (!err) return "Sunucu tarafında beklenmedik bir hata oluştu.";

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return "Dosya boyutu izin verilen sınırı (200 MB) aşıyor.";
      case "LIMIT_FILE_COUNT":
        return "Yüklenebilecek dosya sayısı sınırı aşıldı.";
      case "LIMIT_UNEXPECTED_FILE":
        return "Beklenmeyen dosya alanı gönderildi.";
      case "LIMIT_PART_COUNT":
        return "İstek gövdesi parça sayısı sınırı aşıldı.";
      case "LIMIT_FIELD_KEY":
        return "Alan adı çok uzun.";
      case "LIMIT_FIELD_VALUE":
        return "Alan değeri çok uzun.";
      case "LIMIT_FIELD_COUNT":
        return "Gönderilen alan sayısı sınırı aşıldı.";
      default:
        return "Dosya yükleme hatası.";
    }
  }

  if (err.type === "entity.parse.failed") {
    return "Geçersiz JSON gövdesi gönderildi.";
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return "Bu kayıt zaten mevcut.";
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return "İlişkili kayıt bulunamadığı için işlem tamamlanamadı.";
  }

  if (err.name === "SyntaxError" && /JSON/i.test(err.message)) {
    return "Geçersiz JSON biçimi.";
  }

  return err.message || "Sunucu tarafında beklenmedik bir hata oluştu.";
}

module.exports = { translateErrorMessage };
