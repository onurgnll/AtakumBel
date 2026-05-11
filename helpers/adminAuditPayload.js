"use strict";

const MAX_AUDIT_CHARS = 24000;

const SENSITIVE_KEY =
  /^(password|passwd|pwd|token|secret|authorization|cookie|set-cookie|refreshtoken|accesstoken|totp|otp|setupToken|challengeToken|totp_secret|apikey|api_key)$/i;

function isLikelyJwt(str) {
  if (typeof str !== "string" || str.length < 60) return false;
  const parts = str.split(".");
  return parts.length === 3 && parts.every((p) => /^[A-Za-z0-9_-]+$/.test(p));
}

function redactDeep(value, depth = 0) {
  if (depth > 14) return "[…]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    if (/^Bearer\s+/i.test(value)) return "[Bearer gizlendi]";
    if (isLikelyJwt(value)) return "[JWT gizlendi]";
    if (value.length > 1200) {
      return `${value.slice(0, 400)}… [${value.length} karakter]`;
    }
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "bigint") return String(value);
  if (Buffer.isBuffer(value)) return "[binary]";
  if (Array.isArray(value)) return value.map((v) => redactDeep(v, depth + 1));
  if (typeof value !== "object") return String(value);

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (SENSITIVE_KEY.test(k)) out[k] = "***";
    else out[k] = redactDeep(v, depth + 1);
  }
  return out;
}

function cloneJsonSafe(obj) {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== "object") return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return { _note: "Serileştirilemedi", _type: typeof obj };
  }
}

function truncate(str) {
  if (!str) return null;
  if (str.length <= MAX_AUDIT_CHARS) return str;
  return `${str.slice(0, MAX_AUDIT_CHARS)}\n… [${str.length} karakter, kesildi]`;
}

/** Multer / benzeri: ikili içerik loglanmaz, yalnızca meta. */
function summarizeUploadedFiles(req) {
  const out = [];
  const push = (fieldname, f) => {
    if (!f || typeof f !== "object") return;
    out.push({
      alan: fieldname || f.fieldname,
      dosya_adi: f.originalname,
      mime_tur: f.mimetype,
      boyut_bayt: typeof f.size === "number" ? f.size : undefined,
    });
  };
  if (req.file) push(req.file.fieldname, req.file);
  if (Array.isArray(req.files)) {
    for (const f of req.files) push(f.fieldname, f);
  } else if (req.files && typeof req.files === "object") {
    for (const [field, val] of Object.entries(req.files)) {
      const arr = Array.isArray(val) ? val : [val];
      for (const f of arr) push(field, f);
    }
  }
  return out.length ? out : null;
}

/**
 * İstekten çıkarılan düz nesne (JSON.stringify öncesi).
 * res "finish" anında çağrılmalı (multer sonrası).
 */
function buildAuditRequestPayloadObject(req) {
  const files = summarizeUploadedFiles(req);
  const body = req.body;

  if (body === undefined || body === null) {
    if (files) return { _yuklenenDosyalar: files };
    return null;
  }

  if (Buffer.isBuffer(body)) {
    if (files) return { _binaryIstek: "[binary istek gövdesi]", _yuklenenDosyalar: files };
    return { _binaryIstek: "[binary istek gövdesi]" };
  }

  let merged = null;

  if (typeof body === "string") {
    const t = body.trim();
    if (t) {
      try {
        merged = redactDeep(JSON.parse(t));
      } catch {
        merged = { _ham_metin: redactDeep(body) };
      }
    }
  } else if (typeof body === "object") {
    const keys = Object.keys(body);
    if (keys.length > 0) merged = redactDeep(cloneJsonSafe(body));
  }

  if (files) {
    if (merged && typeof merged === "object" && !Array.isArray(merged)) {
      merged._yuklenenDosyalar = files;
    } else if (merged !== null && merged !== undefined) {
      merged = { _formAlanlari: merged, _yuklenenDosyalar: files };
    } else {
      merged = { _yuklenenDosyalar: files };
    }
  }

  return merged;
}

/**
 * İstek gövdesi + form alanları + yüklenen dosya meta (içerik yok).
 * Çağrıyı mümkünse tüm body parser / multer zinciri bittikten sonra yapın
 * (ör. res "finish"); aksi halde multipart’ta req.body boş kalır.
 */
function serializeRequestBody(req) {
  const merged = buildAuditRequestPayloadObject(req);
  if (merged === null || merged === undefined) return null;
  try {
    return truncate(JSON.stringify(merged, null, 2));
  } catch {
    return null;
  }
}

function serializeResponsePayload(payload) {
  if (payload === undefined) return null;
  try {
    const redacted = redactDeep(cloneJsonSafe(payload));
    return truncate(JSON.stringify(redacted, null, 2));
  } catch {
    try {
      return truncate(String(payload));
    } catch {
      return null;
    }
  }
}

/**
 * res.json çıktısını yakalar (tek çağrı varsayımı).
 * @param {import('express').Response} res
 * @param {(payload: unknown) => void} onCapture
 */
function attachJsonResponseCapture(res, onCapture) {
  const origJson = res.json.bind(res);
  res.json = function captureJson(body) {
    try {
      onCapture(body);
    } catch (_) {
      /* yut */
    }
    return origJson(body);
  };
}

module.exports = {
  buildAuditRequestPayloadObject,
  serializeRequestBody,
  serializeResponsePayload,
  attachJsonResponseCapture,
  redactDeep,
  cloneJsonSafe,
  truncate,
  MAX_AUDIT_CHARS,
};
