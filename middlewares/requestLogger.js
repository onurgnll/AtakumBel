const logger = require("../utils/logger");
const { getClientIp } = require("../helpers/getClientIp");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const status = res.statusCode;
    const ip = getClientIp(req);
    const meta = {
      type: "http",
      method: req.method,
      url: req.originalUrl || req.url,
      status,
      durationMs,
      ip,
      userAgent: String(req.get("user-agent") || "").slice(0, 500),
      contentLength: res.get("content-length") || null,
      referer: req.get("referer") || null,
    };

    const message = `${meta.method} ${meta.url} ${status} ${durationMs}ms - ${ip}`;
    if (status >= 500) {
      logger.error(message, meta);
    } else if (status >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  });

  next();
};

module.exports = requestLogger;
