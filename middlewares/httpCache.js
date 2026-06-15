const logger = require("../utils/logger");
const {
  cache,
  isEnabled,
  buildCacheKey,
  flushRouteCache,
} = require("../utils/cache");

const getResourcePrefix = (req) => {
  const pathOnly = req.originalUrl.split("?")[0];
  const segments = pathOnly.split("/").filter(Boolean);

  if (segments.length >= 2) {
    return `/${segments[0]}/${segments[1]}`;
  }

  return `/${segments.join("/")}`;
};

const SKIP_PREFIXES = ["/api/admin", "/api/search"];

const RELATED_CACHE_ROUTES = {
  "/api/news-galleries": ["/api/news"],
  "/api/event-galleries": ["/api/events"],
  "/api/facility-galleries": ["/api/facilities"],
  "/api/press-release-galleries": ["/api/press-releases"],
  "/api/president-galleries": ["/api/president"],
};

const invalidateRouteCaches = (baseUrl) => {
  flushRouteCache(baseUrl);

  const related = RELATED_CACHE_ROUTES[baseUrl];
  if (related) {
    for (const route of related) {
      flushRouteCache(route);
    }
  }
};

const shouldSkipCache = (req) => {
  if (!isEnabled()) return true;
  if (req.method !== "GET") return true;
  if (req.headers.authorization) return true;
  if (req.query.admin === "true") return true;

  const path = getResourcePrefix(req);
  return SKIP_PREFIXES.some((prefix) => path.startsWith(prefix));
};

const cacheMiddleware = (req, res, next) => {
  if (shouldSkipCache(req)) {
    return next();
  }

  const key = buildCacheKey(req);
  const cached = cache.get(key);

  if (cached) {
    res.set("X-Cache", "HIT");
    return res.status(cached.status).json(cached.body);
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, { status: res.statusCode, body });
      res.set("X-Cache", "MISS");
      logger.debug(`Cache yazıldı: ${key}`);
    }

    return originalJson(body);
  };

  return next();
};

const invalidateCacheMiddleware = (req, res, next) => {
  if (!isEnabled()) {
    return next();
  }

  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidateRouteCaches(getResourcePrefix(req));
    }

    return originalJson(body);
  };

  return next();
};

module.exports = {
  cacheMiddleware,
  invalidateCacheMiddleware,
};
