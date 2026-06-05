const os = require("os");
const path = require("path");
const checkDiskSpacePkg = require("check-disk-space");
const checkDiskSpace =
  typeof checkDiskSpacePkg === "function"
    ? checkDiskSpacePkg
    : checkDiskSpacePkg?.default;
const { sequelize } = require("../models");

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function bytesToMiB(b) {
  return Math.round((Number(b) / 1024 / 1024) * 10) / 10;
}

function toLocalYmd(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

let lastCpuSnapshot = null;
let lastCpuAt = 0;

function readCpuSnapshot() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const c of cpus) {
    idle += c.times.idle;
    total += c.times.user + c.times.nice + c.times.sys + c.times.irq + c.times.idle;
  }
  return { idle, total, count: cpus.length };
}

function computeCpuUsagePercent() {
  const now = Date.now();
  const snap = readCpuSnapshot();
  if (!lastCpuSnapshot) {
    lastCpuSnapshot = snap;
    lastCpuAt = now;
    return null;
  }
  const idleDelta = snap.idle - lastCpuSnapshot.idle;
  const totalDelta = snap.total - lastCpuSnapshot.total;
  lastCpuSnapshot = snap;
  lastCpuAt = now;
  if (totalDelta <= 0) return null;
  const usage = 1 - idleDelta / totalDelta;
  return Math.max(0, Math.min(100, Math.round(usage * 1000) / 10));
}

exports.getSystemInfo = async (req, res, next) => {
  try {
    const rootPath = path.parse(process.cwd()).root || "C:\\";
    let disk = null;
    try {
      if (typeof checkDiskSpace === "function") {
        disk = await checkDiskSpace(rootPath);
      }
    } catch {
      disk = null;
    }

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = Math.max(0, totalMem - freeMem);
    const cpuPercent = computeCpuUsagePercent();

    const procMem = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());

    return res.json({
      success: 1,
      data: {
        now: new Date().toISOString(),
        api: {
          uptime_sec: uptimeSec,
          uptime_human: `${Math.floor(uptimeSec / 3600)} sa ${Math.floor((uptimeSec % 3600) / 60)} dk ${uptimeSec % 60} sn`,
          node: process.version,
          pid: process.pid,
        },
        system: {
          platform: process.platform,
          arch: process.arch,
          cpu_count: os.cpus()?.length ?? null,
          cpu_usage_percent: cpuPercent,
          mem_total_mib: bytesToMiB(totalMem),
          mem_used_mib: bytesToMiB(usedMem),
          mem_free_mib: bytesToMiB(freeMem),
          disk_path: rootPath,
          disk_total_gib: disk ? Math.round((disk.size / 1024 / 1024 / 1024) * 10) / 10 : null,
          disk_free_gib: disk ? Math.round((disk.free / 1024 / 1024 / 1024) * 10) / 10 : null,
        },
        process: {
          rss_mib: bytesToMiB(procMem.rss),
          heap_used_mib: bytesToMiB(procMem.heapUsed),
          heap_total_mib: bytesToMiB(procMem.heapTotal),
        },
      },
      message: "Sistem bilgisi getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const days = clampInt(req.query.days, { min: 1, max: 60, fallback: 14 });

    // Postgres uyumlu günlük grup
    const rows = await sequelize.query(
      `
      SELECT DATE("createdAt") AS day, COUNT(*)::int AS count
      FROM "AdminAuditLogs"
      WHERE "createdAt" >= (NOW() - (:days || ' days')::interval)
      GROUP BY day
      ORDER BY day ASC
      `,
      {
        replacements: { days },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    const map = new Map();
    for (const r of rows) {
      const day = toLocalYmd(r.day) ?? String(r.day).slice(0, 10);
      map.set(day, Number(r.count) || 0);
    }

    const series = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = toLocalYmd(d);
      series.push({ day: key, count: map.get(key) ?? 0 });
    }

    const total = series.reduce((acc, s) => acc + s.count, 0);

    return res.json({
      success: 1,
      data: {
        days,
        total,
        series,
      },
      message: "Aktivite serisi getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

