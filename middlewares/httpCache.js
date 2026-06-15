const {
  cache,
  isEnabled,
  buildCacheKey,
  flushRouteCache,
  logCache,
  TTL_SECONDS,
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

const getCacheSkipReason = (req) => {
  if (!isEnabled()) return "disabled";
  if (req.method !== "GET") return null;
  if (req.headers.authorization) return "authorization";
  if (req.query.admin === "true") return "admin_query";

  const path = getResourcePrefix(req);
  if (SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return "excluded_route";
  }

  return null;
};

const invalidateRouteCaches = (baseUrl, meta = {}) => {
  const flushed = [{ prefix: baseUrl, count: flushRouteCache(baseUrl) }];
  const related = RELATED_CACHE_ROUTES[baseUrl];

  if (related) {
    for (const route of related) {
      flushed.push({ prefix: route, count: flushRouteCache(route), related: true });
    }
  }

  const totalFlushed = flushed.reduce((sum, item) => sum + item.count, 0);
  if (totalFlushed > 0) {
    logCache("invalidate", {
      ...meta,
      resource: baseUrl,
      flushed,
      totalFlushed,
    });
  }
};

const cacheMiddleware = (req, res, next) => {
  const skipReason = getCacheSkipReason(req);
  if (skipReason) {
    if (req.method === "GET") {
      logCache("skip", {
        method: req.method,
        url: req.originalUrl,
        reason: skipReason,
      });
    }
    return next();
  }

  const key = buildCacheKey(req);
  const cached = cache.get(key);

  if (cached) {
    logCache("hit", {
      method: req.method,
      url: req.originalUrl,
      key,
      status: cached.status,
    });
    res.set("X-Cache", "HIT");
    return res.status(cached.status).json(cached.body);
  }

  logCache("lookup", {
    method: req.method,
    url: req.originalUrl,
    key,
    result: "miss",
  });

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, { status: res.statusCode, body });
      res.set("X-Cache", "MISS");
      logCache("store", {
        method: req.method,
        url: req.originalUrl,
        key,
        status: res.statusCode,
        ttlSeconds: TTL_SECONDS,
      });
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
      invalidateRouteCaches(getResourcePrefix(req), {
        method,
        url: req.originalUrl,
      });
    }

    return originalJson(body);
  };

  return next();
};

module.exports = {
  cacheMiddleware,
  invalidateCacheMiddleware,
};
