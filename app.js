require("dotenv").config();
const logger = require("./utils/logger");
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const routes = require("./routes/index");
const requestGuard = require("./middlewares/requestGuard");
const { translateErrorMessage } = require("./helpers/translateErrorMessage");
const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("Güvenlik anahtarı tanımlı değil. Uygulama başlatılamıyor.");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const path = require("path");
app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/api", requestGuard);
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
    console.log("Veritabanı bağlantısı başarılı.");
    app.listen(PORT, "::" , () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
    });
  } catch (error) {
    console.error("Veritabanına bağlanılamadı:", error);
  }
}
startServer();
