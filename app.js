require("dotenv").config();
const logger = require("./utils/logger");
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes/index");
const requestGuard = require("./middlewares/requestGuard");
const { translateErrorMessage } = require("./helpers/translateErrorMessage");
const requestLogger = require("./middlewares/requestLogger");
const {
  cacheMiddleware,
  invalidateCacheMiddleware,
} = require("./middlewares/httpCache");
const {
  generalRateLimiter,
  authRateLimiter,
  searchRateLimiter,
  publicWriteRateLimiter,
} = require("./middlewares/rateLimit");
const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("Güvenlik anahtarı tanımlı değil. Uygulama başlatılamıyor.");
}

const trustProxy = process.env.TRUST_PROXY;
if (trustProxy === "true") {
  app.set("trust proxy", true);
} else if (trustProxy === "false") {
  app.set("trust proxy", false);
} else if (trustProxy && /^\d+$/.test(trustProxy)) {
  app.set("trust proxy", Number(trustProxy));
} else {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

if(process.env.CORS_ORIGIN) {
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
} else {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

const PORT = process.env.PORT || 5002;
const path = require("path");
app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/admin/login", authRateLimiter);
app.use("/api/search", searchRateLimiter);
app.use("/api/suggestions", publicWriteRateLimiter);
app.use("/api/service-forms", publicWriteRateLimiter);
app.use("/api", generalRateLimiter);

app.use("/api", requestGuard);
app.use("/api", invalidateCacheMiddleware);
app.use("/api", cacheMiddleware);
app.use("/api", routes);

app.use((err, req, res, next) => {
  logger.error(`HATA: ${req.method} ${req.url} - ${err.message}`);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  res.status(status).json({
    success: 0,
    message: translateErrorMessage(err),
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info("Veritabanı bağlantısı başarılı.");
    app.listen(PORT, "::", () => {
      logger.info(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
    });
  } catch (error) {
    logger.error("Veritabanına bağlanılamadı", { error: error.message, stack: error.stack });
  }
}
startServer();
