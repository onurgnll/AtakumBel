const { getClientIp } = require("../helpers/getClientIp");
const {
  serializeResponsePayload,
  attachJsonResponseCapture,
} = require("../helpers/adminAuditPayload");
const {
  buildAuditRequestBodyWithDiff,
  loadAuditMutationSnapshot,
} = require("../helpers/auditUpdateSnapshot");
const { labelAction, labelModule } = require("../helpers/errorLabels");

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

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: 0,
          message: "Sunucu yapılandırma hatası: güvenlik anahtarı tanımlı değil.",
        });
      }
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;

      if (req.method === "PUT" || req.method === "PATCH" || req.method === "POST") {
        try {
          req._auditPreviousRowSnapshot = await loadAuditMutationSnapshot(req);
        } catch (e) {
          console.error("[auditMutationSnapshot]", e.message);
          req._auditPreviousRowSnapshot = null;
        }
      } else {
        req._auditPreviousRowSnapshot = null;
      }

      if (req.method !== "GET") {
        const startedAt = Date.now();
        const pathLogged = String(req.originalUrl || req.url || "")
          .split("?")[0]
          .slice(0, 2000);
        const capture = { responseText: null };
        attachJsonResponseCapture(res, (payload) => {
          capture.responseText = serializeResponsePayload(payload);
        });
        const logPayload = {
          adminId: decoded.id,
          method: req.method,
          path: pathLogged,
          ip: getClientIp(req),
          userAgent: String(req.get("user-agent") || "").slice(0, 500),
          capture,
        };
        res.on("finish", () => {
          setImmediate(async () => {
            try {
              const requestBodyText = await buildAuditRequestBodyWithDiff(req);
              const { AdminAuditLog } = require("../models");
              await AdminAuditLog.create({
                admin_id: logPayload.adminId,
                method: logPayload.method,
                path: logPayload.path,
                status_code: res.statusCode,
                duration_ms: Date.now() - startedAt,
                ip: logPayload.ip,
                user_agent: logPayload.userAgent || null,
                request_body: requestBodyText,
                response_body: logPayload.capture.responseText,
              });
            } catch (e) {
              console.error("[AdminAuditLog]", e.message);
            }
          });
        });
      }

      return next();
    } catch (err) {
      return res.status(401).json({
        success: 0,
        message: "Yetkisiz erişim! Geçersiz veya süresi dolmuş erişim belirteci.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: 0,
      message: "Yetkisiz erişim! Erişim belirteci bulunamadı.",
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
      message: `'${labelModule(moduleName)}' modülünde ${labelAction(requestedAction)} yetkiniz bulunmamaktadır.`,
    });
  };
};

const authorizeSuperAdmin = (req, res, next) => {
  if (req.admin?.role === "superadmin") {
    return next();
  }
  return res.status(403).json({
    success: 0,
    message: "Bu işlem için üst yönetici yetkisi gereklidir.",
  });
};

/** Geçerli Bearer token varsa req.admin doldurur; yoksa veya geçersizse isteği kesmez. */
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    process.env.JWT_SECRET
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      req.admin = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // Public endpoint: invalid token is ignored
    }
  }
  return next();
};

module.exports = { protect, optionalProtect, authorize, authorizeSuperAdmin };
