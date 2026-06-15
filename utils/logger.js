const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const consoleFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  const { service, ...rest } = meta;
  const metaStr = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : "";
  return `${timestamp} [${level}]: ${message}${metaStr}`;
});

const fileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.json(),
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "atakumbel-api" },
  transports: [
    new transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: fileFormat,
    }),
    new transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: fileFormat,
    }),
    new transports.File({
      filename: path.join(logsDir, "access.log"),
      format: fileFormat,
    }),
  ],
});

const consoleTransport = new transports.Console({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    process.env.NODE_ENV === "production" ? format.uncolorize() : format.colorize(),
    consoleFormat,
  ),
});

logger.add(consoleTransport);

module.exports = logger;
