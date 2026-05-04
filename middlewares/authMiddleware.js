const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        success: 0,
        message: "Yetkisiz erişim! Geçersiz veya süresi dolmuş token.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: 0,
      message: "Yetkisiz erişim! Token bulunamadı.",
    });
  }
};

// 2. Aşama: Yetki Kontrolü (İlgili modüle erişim izni var mı?)
// Bu fonksiyon bir "middleware factory"dir; modül adını parametre olarak alır.
const authorize = (moduleName) => {
  return (req, res, next) => {
    // req.admin verisi bir önceki 'protect' middleware'inden geliyor
    const { permissions } = req.admin;

    // 1. Süper Admin mi? (JSON içindeki 'all: true' kontrolü)
    if (permissions && permissions.all === true) {
      return next();
    }

    // 2. Modül bazlı yetki kontrolü (Örn: permissions.news === "write")
    if (permissions && permissions[moduleName] === "write") {
      return next();
    }
    return res.status(403).json({
      success: 0,
      message: `Bu işlemi gerçekleştirmek için '${moduleName}' modülünde yetkiniz bulunmamaktadır.`,
    });
  };
};

module.exports = { protect, authorize };
