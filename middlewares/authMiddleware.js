const jwt = require("jsonwebtoken");

const getActionFromRequest = (req) => {
  if (req.method === "POST") return "create";
  if (req.method === "PUT" || req.method === "PATCH") return "update";
  if (req.method === "DELETE") return "delete";
  return "read";
};

const hasModulePermission = (permissions, moduleName, action) => {
  if (!permissions || typeof permissions !== "object") return false;
  if (permissions.all === true) return true;

  const modulePermission = permissions[moduleName];
  if (!modulePermission) return false;

  // Legacy compatibility: { module: "write" } / { module: "read" }
  if (modulePermission === "write") return true;
  if (modulePermission === "read") return action === "read";
  if (modulePermission === true) return true;

  if (typeof modulePermission === "object") {
    return Boolean(modulePermission[action]);
  }
  return false;
};

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: 0,
          message: "Sunucu yapılandırma hatası: JWT_SECRET tanımlı değil.",
        });
      }
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
const authorize = (moduleName, action) => {
  return (req, res, next) => {
    const { permissions, role } = req.admin;
    const requestedAction = action || getActionFromRequest(req);

    if (role === "superadmin") {
      return next();
    }

    if (hasModulePermission(permissions, moduleName, requestedAction)) {
      return next();
    }

    return res.status(403).json({
      success: 0,
      message: `'${moduleName}' modülünde '${requestedAction}' yetkiniz bulunmamaktadır.`,
    });
  };
};

const authorizeSuperAdmin = (req, res, next) => {
  if (req.admin?.role === "superadmin") {
    return next();
  }
  return res.status(403).json({
    success: 0,
    message: "Bu işlem için superadmin yetkisi gereklidir.",
  });
};

module.exports = { protect, authorize, authorizeSuperAdmin };
