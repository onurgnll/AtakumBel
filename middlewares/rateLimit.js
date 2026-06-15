const rateLimit = require("express-rate-limit");
const { getClientIp } = require("../helpers/getClientIp");

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const isRateLimitEnabled = () => {
  const flag = String(process.env.RATE_LIMIT_ENABLED ?? "true").toLowerCase();
  return !["0", "false", "off", "no"].includes(flag);
};

const whitelist = new Set(
  String(process.env.RATE_LIMIT_WHITELIST || "127.0.0.1,::1")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean),
);

const shouldSkip = (req) => {
  if (!isRateLimitEnabled()) return true;
  const ip = getClientIp(req);
  return whitelist.has(ip);
};

const rateLimitResponse = (message) => ({
  success: 0,
  message,
});

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => getClientIp(req),
    skip: shouldSkip,
    handler: (req, res) => {
      res.status(429).json(rateLimitResponse(message));
    },
    validate: {
      trustProxy: false,
      xForwardedForHeader: false,
    },
  });

const generalRateLimiter = createLimiter({
  windowMs: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parsePositiveInt(process.env.RATE_LIMIT_MAX, 300),
  message: "Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyin.",
});

const authRateLimiter = createLimiter({
  windowMs: parsePositiveInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS, 15 * 60 * 1000),
  max: parsePositiveInt(process.env.RATE_LIMIT_AUTH_MAX, 10),
  message: "Çok fazla giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin.",
});

const searchRateLimiter = createLimiter({
  windowMs: parsePositiveInt(process.env.RATE_LIMIT_SEARCH_WINDOW_MS, 60 * 1000),
  max: parsePositiveInt(process.env.RATE_LIMIT_SEARCH_MAX, 30),
  message: "Arama isteği limiti aşıldı. Lütfen kısa bir süre bekleyin.",
});

const publicWriteRateLimiter = createLimiter({
  windowMs: parsePositiveInt(process.env.RATE_LIMIT_WRITE_WINDOW_MS, 60 * 60 * 1000),
  max: parsePositiveInt(process.env.RATE_LIMIT_WRITE_MAX, 20),
  message: "Form gönderim limiti aşıldı. Lütfen daha sonra tekrar deneyin.",
});

module.exports = {
  generalRateLimiter,
  authRateLimiter,
  searchRateLimiter,
  publicWriteRateLimiter,
};
