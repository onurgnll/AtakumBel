"use strict";

const {
  buildAuditRequestPayloadObject,
  redactDeep,
  cloneJsonSafe,
  truncate,
} = require("./adminAuditPayload");

/** İlk path segmenti (api sonrası) → Sequelize model adı (models/index) */
const ROUTE_TO_MODEL = {
  news: "News",
  publications: "Publication",
  events: "Event",
  facilities: "Facility",
  departments: "Department",
  directives: "Directive",
  employees: "Employee",
  "council-members": "CouncilMember",
  "gathering-areas": "GatheringArea",
  "free-wifi-points": "FreeWifiPoint",
  "waste-points": "WastePoint",
  marketplaces: "Marketplace",
  "vice-presidents": "VicePresident",
  "press-materials": "PressMaterial",
  "activity-reports": "ActivityReport",
  "financial-expectation-reports": "FinancialExpectationReport",
  "performance-programs": "PerformanceProgram",
  "audit-reports": "AuditReport",
  "strategic-plans": "StrategicPlan",
  "kvkk-documents": "KvkkDocument",
  services: "Service",
  suggestions: "Suggestion",
  "news-galleries": "NewsGallery",
  "event-galleries": "EventGallery",
  "facility-galleries": "FacilityGallery",
  "president-galleries": "PresidentGallery",
  "service-forms": "ServiceForm",
  admin: "Admin",
};

/**
 * POST ile upsert: URL /api/{tek_segment} iken güncellemeden önceki satır.
 * Yeni loader eklemek için buraya ekleyin.
 */
const POST_UPSERT_LOADERS = {
  president: async (models) => {
    const row = await models.President.findOne({
      order: [["id", "DESC"]],
      raw: true,
    });
    return row || null;
  },
};

const INTERNAL_KEYS = /^_/;

function parseApiRootAndId(url) {
  const parts = String(url || "")
    .split("?")[0]
    .split("/")
    .filter(Boolean);
  const i = parts[0] === "api" ? 1 : 0;
  const slice = parts.slice(i);
  if (slice.length < 2) return { root: null, id: null };
  const root = slice[0];
  const last = slice[slice.length - 1];
  if (!/^\d+$/.test(last)) return { root, id: null };
  return { root, id: Number.parseInt(last, 10) };
}

/** Örn. /api/president → president */
function parseSingleSegmentRootAfterApi(url) {
  const parts = String(url || "")
    .split("?")[0]
    .split("/")
    .filter(Boolean);
  const i = parts[0] === "api" ? 1 : 0;
  const slice = parts.slice(i);
  if (slice.length !== 1) return null;
  return slice[0];
}

function truncateStringFields(obj, maxLen, depth = 0) {
  if (depth > 14) return "[…]";
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    if (obj.length <= maxLen) return obj;
    return `${obj.slice(0, Math.min(500, maxLen))}… [${obj.length} karakter]`;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return obj;
  if (Array.isArray(obj)) return obj.map((x) => truncateStringFields(x, maxLen, depth + 1));
  if (typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = truncateStringFields(v, maxLen, depth + 1);
    }
    return out;
  }
  return obj;
}

/** Form / DB farkı: true, "true", 1 aynı; false, "false", 0 aynı */
function looseBoolean(v) {
  if (v === true || v === 1) return true;
  if (v === false || v === 0) return false;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "") return undefined;
    if (s === "true" || s === "1" || s === "yes" || s === "on") return true;
    if (s === "false" || s === "0" || s === "no" || s === "off") return false;
  }
  return undefined;
}

/**
 * Dizi / nesne: DB’de obje, formda minify JSON string veya girintili string → aynı içerik eşit sayılır.
 */
function jsonStructuralCanonical(v) {
  if (v === null || v === undefined) return null;
  if (Buffer.isBuffer(v)) return null;
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return null;
    }
  }
  if (typeof v === "string") {
    const t = v.trim();
    if (!t || (t[0] !== "{" && t[0] !== "[")) return null;
    try {
      const parsed = JSON.parse(t);
      if (parsed === null || typeof parsed !== "object") return null;
      return JSON.stringify(parsed);
    } catch {
      return null;
    }
  }
  return null;
}

function auditValuesSemanticallyEqual(a, b) {
  if (a === b) return true;
  if (a == null && b == null) return true;
  const ba = looseBoolean(a);
  const bb = looseBoolean(b);
  if (ba !== undefined && bb !== undefined) return ba === bb;

  if (a != null && b != null) {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb) && na === nb) {
      const aNum = typeof a === "number";
      const bNum = typeof b === "number";
      const aStrNum = typeof a === "string" && a.trim() !== "" && !Number.isNaN(Number(a));
      const bStrNum = typeof b === "string" && b.trim() !== "" && !Number.isNaN(Number(b));
      if (aNum || bNum || aStrNum || bStrNum) return true;
    }
  }

  const ca = jsonStructuralCanonical(a);
  const cb = jsonStructuralCanonical(b);
  if (ca !== null && cb !== null && ca === cb) return true;

  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return String(a) === String(b);
  }
}

/**
 * İstekte gönderilen alanlar için: veritabanındaki önceki değer ≠ yeni değer.
 */
function diffChangedFields(oldObj, newObj) {
  const changes = [];
  if (!newObj || typeof newObj !== "object" || Array.isArray(newObj)) return changes;
  const old = oldObj && typeof oldObj === "object" && !Array.isArray(oldObj) ? oldObj : {};

  for (const [k, guncel] of Object.entries(newObj)) {
    if (INTERNAL_KEYS.test(k)) continue;
    if (k === "_yuklenenDosyalar") {
      changes.push({
        alan: "_yuklenenDosyalar",
        aciklama: "Yüklenen dosya(lar); önceki kayıtta dosya listesi yoktur.",
        onceki: null,
        guncel,
      });
      continue;
    }
    const onceki = Object.prototype.hasOwnProperty.call(old, k) ? old[k] : undefined;
    if (auditValuesSemanticallyEqual(onceki, guncel)) continue;
    changes.push({ alan: k, onceki, guncel });
  }
  return changes;
}

/**
 * PUT/PATCH: /api/{kaynak}/{id} öncesi satır.
 * @param {import('express').Request} req
 */
async function loadAuditPreviousSnapshotForRequest(req) {
  const path = req.originalUrl || req.url || "";
  const { root, id } = parseApiRootAndId(path);
  if (!root || id == null) return null;

  const modelName = ROUTE_TO_MODEL[root];
  if (!modelName) return null;

  const models = require("../models");
  const Model = models[modelName];
  if (!Model || typeof Model.findByPk !== "function") return null;

  const row = await Model.findByPk(id, { raw: true });
  if (!row) return null;

  return truncateStringFields(redactDeep(cloneJsonSafe(row)), 2000);
}

/**
 * POST upsert: tanımlı tek-segment rotalar için mevcut satır (yoksa null).
 */
async function loadAuditPostUpsertSnapshot(req) {
  if ((req.method || "").toUpperCase() !== "POST") return null;
  const root = parseSingleSegmentRootAfterApi(req.originalUrl || req.url || "");
  if (!root || !POST_UPSERT_LOADERS[root]) return null;
  try {
    const models = require("../models");
    const loader = POST_UPSERT_LOADERS[root];
    return await loader(models);
  } catch (e) {
    console.error("[auditPostUpsertSnapshot]", root, e.message);
    return null;
  }
}

async function loadAuditMutationSnapshot(req) {
  const m = (req.method || "").toUpperCase();
  if (m === "PUT" || m === "PATCH") return loadAuditPreviousSnapshotForRequest(req);
  if (m === "POST") return loadAuditPostUpsertSnapshot(req);
  return null;
}

function serializePlainCurrent(req) {
  const current = buildAuditRequestPayloadObject(req);
  if (current === null || current === undefined) return null;
  try {
    return truncate(JSON.stringify(current, null, 2));
  } catch {
    return null;
  }
}

/**
 * Önceki satır + istek + alan farkları (PUT/PATCH veya POST upsert).
 * @param {import('express').Request} req
 * @returns {Promise<string|null>}
 */
async function buildAuditRequestBodyWithDiff(req) {
  const method = (req.method || "").toUpperCase();
  const previous = req._auditPreviousRowSnapshot;

  if (previous && (method === "PUT" || method === "PATCH" || method === "POST")) {
    const current = buildAuditRequestPayloadObject(req);
    const guncellemeIstegi =
      current && typeof current === "object"
        ? truncateStringFields(redactDeep(cloneJsonSafe(current)), 2000)
        : {};

    const degisenAlanlar = diffChangedFields(previous, guncellemeIstegi);

    const packaged = {
      _islemTipi: "guncelleme",
      _oncekiKayit: previous,
      _guncellemeIstegi: guncellemeIstegi,
      _degisenAlanlar: degisenAlanlar,
    };

    try {
      return truncate(JSON.stringify(packaged, null, 2));
    } catch {
      return serializePlainCurrent(req);
    }
  }

  return serializePlainCurrent(req);
}

module.exports = {
  buildAuditRequestBodyWithDiff,
  loadAuditMutationSnapshot,
  loadAuditPreviousSnapshotForRequest,
  loadAuditPostUpsertSnapshot,
  ROUTE_TO_MODEL,
  parseApiRootAndId,
};
