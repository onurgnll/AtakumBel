const PRIVATE_IPV4 =
  /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;

const normalizeIp = (ip) => {
  if (!ip || typeof ip !== "string") return null;
  const trimmed = ip.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("::ffff:")) return trimmed.slice(7);
  if (trimmed === "::1") return "127.0.0.1";
  return trimmed;
};

const isPrivateIp = (ip) => {
  const normalized = normalizeIp(ip);
  if (!normalized) return true;
  if (normalized.includes(":")) {
    return (
      normalized.startsWith("fe80:") ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd")
    );
  }
  return PRIVATE_IPV4.test(normalized);
};

const collectIpCandidates = (req) => {
  const candidates = [];

  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    candidates.push(
      ...String(forwarded)
        .split(",")
        .map((part) => normalizeIp(part))
        .filter(Boolean),
    );
  }

  const singleHeaders = [
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
    "x-client-ip",
  ];

  for (const header of singleHeaders) {
    const value = req.headers[header];
    if (value) {
      const normalized = normalizeIp(String(value));
      if (normalized) candidates.push(normalized);
    }
  }

  const socketIp = normalizeIp(req.ip || req.socket?.remoteAddress);
  if (socketIp) candidates.push(socketIp);

  return candidates;
};

const getClientIp = (req) => {
  const candidates = collectIpCandidates(req);

  for (const ip of candidates) {
    if (!isPrivateIp(ip)) return ip;
  }

  return candidates[0] || "unknown";
};

module.exports = { getClientIp, normalizeIp, isPrivateIp };
