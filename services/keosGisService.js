"use strict";

/**
 * KEOS (Netcad GIS API) entegrasyon servisi.
 * Bkz. AtakumVeriEntegrasyon.pdf - "Kent Haritası" veri entegrasyon spesifikasyonu.
 *
 * Akış: login -> sessionid al -> query/GeoJSON isteklerinde sessionid kullan.
 * Session süresi dolabildiği için sorgu sırasında yetkisiz/başarısız cevap alınırsa
 * bir kez daha login olup istek tekrar denenir.
 */

const logger = require("../utils/logger");

const QUERY_NAMES = {
  WASTE_POINTS: "geosifiratik.servis",
  GATHERING_AREAS: "ext_afad_3.servis",
};

const PRIMARY_KEYS = {
  WASTE_POINTS: "geosifiratik.objectid",
  GATHERING_AREAS: "ext_afad_3.objectid",
};

const SESSION_TTL_MS = Number.parseInt(
  process.env.KEOS_SESSION_TTL_MS || `${20 * 60 * 1000}`,
  10,
);

let sessionState = {
  sessionid: null,
  obtainedAt: 0,
  pendingLogin: null,
};

const getConfig = () => {
  const baseUrl = process.env.KEOS_BASE_URL;
  const apiPrefix = process.env.KEOS_API_PREFIX ?? "/BELNET";
  const userName = process.env.KEOS_USERNAME;
  const password = process.env.KEOS_PASSWORD;

  if (!baseUrl || !userName || !password) {
    throw Object.assign(
      new Error(
        "KEOS Kent Haritası servis bilgileri tanımlı değil. KEOS_BASE_URL, KEOS_USERNAME ve KEOS_PASSWORD ortam değişkenlerini kontrol edin.",
      ),
      { status: 500 },
    );
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), apiPrefix, userName, password };
};

const buildUrl = (path, params = {}) => {
  const { baseUrl, apiPrefix } = getConfig();
  const url = new URL(`${baseUrl}${apiPrefix}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url;
};

const isSessionFresh = () =>
  Boolean(sessionState.sessionid) &&
  Date.now() - sessionState.obtainedAt < SESSION_TTL_MS;

const login = async () => {
  const { userName, password } = getConfig();
  const url = buildUrl("/gisapi/authentication/login");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body || !body.sessionid) {
    logger.error("[keosGisService] Login başarısız", {
      status: response.status,
      body,
    });
    throw Object.assign(
      new Error("KEOS Kent Haritası servisine giriş yapılamadı."),
      { status: 502 },
    );
  }

  sessionState = {
    sessionid: body.sessionid,
    obtainedAt: Date.now(),
    pendingLogin: null,
  };

  logger.info("[keosGisService] Yeni oturum alındı.");
  return sessionState.sessionid;
};

const ensureSession = async (forceRefresh = false) => {
  if (!forceRefresh && isSessionFresh()) {
    return sessionState.sessionid;
  }

  if (!sessionState.pendingLogin) {
    sessionState.pendingLogin = login().finally(() => {
      sessionState.pendingLogin = null;
    });
  }

  return sessionState.pendingLogin;
};

const invalidateSession = () => {
  sessionState.sessionid = null;
  sessionState.obtainedAt = 0;
};

/**
 * @param {Object} options
 * @param {string} options.queryName
 * @param {string} [options.filter]
 * @param {number} [options.pageCount]
 * @param {number} [options.startReadIndex]
 */
const queryGeoJson = async ({ queryName, filter, pageCount, startReadIndex }) => {
  if (!queryName) {
    throw Object.assign(new Error("QueryName parametresi zorunludur."), {
      status: 400,
    });
  }

  const performRequest = async (sessionid) => {
    const url = buildUrl("/gisapi/query/GeoJSON", {
      QueryName: queryName,
      sessionid,
      filter,
      pageCount,
      startReadIndex,
    });

    return fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  };

  let sessionid = await ensureSession();
  let response = await performRequest(sessionid);

  if (response.status === 401 || response.status === 403) {
    invalidateSession();
    sessionid = await ensureSession(true);
    response = await performRequest(sessionid);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    logger.error("[keosGisService] Sorgu başarısız", {
      queryName,
      status: response.status,
      body: text?.slice(0, 500),
    });
    throw Object.assign(
      new Error("KEOS Kent Haritası servisinden veri alınamadı."),
      { status: 502 },
    );
  }

  return response.json();
};

module.exports = {
  QUERY_NAMES,
  PRIMARY_KEYS,
  queryGeoJson,
  ensureSession,
  invalidateSession,
};
