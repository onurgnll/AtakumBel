const NodeCache = require("node-cache");
const logger = require("./logger");

const TTL_SECONDS = Number.parseInt(process.env.CACHE_TTL_SECONDS || "300", 10);
const CHECK_PERIOD = Math.min(60, Math.max(30, Math.floor(TTL_SECONDS / 2)));

const cache = new NodeCache({
  stdTTL: TTL_SECONDS,
  checkperiod: CHECK_PERIOD,
  useClones: false,
});

const isEnabled = () => process.env.CACHE_ENABLED !== "false";

const isCacheLogEnabled = () => {
  if (process.env.CACHE_LOG_ENABLED === "true") return true;
  if (process.env.CACHE_LOG_ENABLED === "false") return false;
  return process.env.NODE_ENV === "development";
};

const logCache = (event, meta = {}) => {
  if (!isCacheLogEnabled()) return;

  logger.info(`[cache] ${event}`, {
    type: "cache",
    event,
    ...meta,
  });
};

const buildCacheKey = (req) => `${req.method}:${req.originalUrl}`;

const flushRouteCache = (baseUrl) => {
  const prefix = `GET:${baseUrl}`;
  const keys = cache.keys();
  let flushed = 0;

  for (const key of keys) {
    if (key.startsWith(prefix)) {
      cache.del(key);
      flushed += 1;
    }
  }

  if (flushed > 0) {
    logCache("flush", { prefix, flushed });
  }

  return flushed;
};

const getStats = () => cache.getStats();

module.exports = {
  cache,
  isEnabled,
  isCacheLogEnabled,
  logCache,
  buildCacheKey,
  flushRouteCache,
  getStats,
  TTL_SECONDS,
};
