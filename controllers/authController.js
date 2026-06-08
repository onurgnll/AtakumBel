const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { normalizePermissions } = require("../helpers/adminPermissions");

const ACCESS_TOKEN_EXPIRY = "1d";
const MFA_SETUP_TOKEN_EXPIRY = "15m";
const MFA_CHALLENGE_TOKEN_EXPIRY = "5m";

function signAccessToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      role: admin.role,
      permissions: normalizePermissions(admin.permissions),
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

function signMfaSetupToken(adminId) {
  return jwt.sign(
    { typ: "mfa_setup", sub: adminId },
    process.env.JWT_SECRET,
    { expiresIn: MFA_SETUP_TOKEN_EXPIRY },
  );
}

function signMfaChallengeToken(adminId) {
  return jwt.sign(
    { typ: "mfa_challenge", sub: adminId },
    process.env.JWT_SECRET,
    { expiresIn: MFA_CHALLENGE_TOKEN_EXPIRY },
  );
}

function verifyTotpCode(secretBase32, code) {
  if (!secretBase32 || !code) return false;
  const token = String(code).replace(/\s/g, "");
  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: "base32",
    token,
    window: 1,
  });
}

// Login (şifre sonrası TOTP kurulumu veya doğrulama adımı)
exports.login = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: 0,
        message: "Sunucu yapılandırma hatası: güvenlik anahtarı tanımlı değil.",
      });
    }

    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res
        .status(401)
        .json({ success: 0, message: "E-posta veya şifre hatalı!" });
    }

    const totpEnabled = Boolean(admin.totp_enabled);
    const hasSecret = Boolean(admin.totp_secret);

    if (totpEnabled && hasSecret) {
      const challengeToken = signMfaChallengeToken(admin.id);
      return res.json({
        success: 1,
        data: {
          mfaRequired: true,
          challengeToken,
        },
        message: "Authenticator doğrulaması gerekli.",
      });
    }

    if (!hasSecret) {
      const secret = speakeasy.generateSecret({ length: 20 });
      await admin.update({ totp_secret: secret.base32, totp_enabled: false });
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: email,
        issuer: "Atakum Belediyesi",
        encoding: "base32",
      });
      const qrDataUrl = await QRCode.toDataURL(otpauthUrl, { margin: 1, width: 240 });
      const setupToken = signMfaSetupToken(admin.id);
      return res.json({
        success: 1,
        data: {
          mfaSetup: true,
          setupToken,
          qrDataUrl,
          otpauthUrl,
        },
        message: "Google Authenticator ile kayıt tamamlanmalı.",
      });
    }

    const otpauthUrl = speakeasy.otpauthURL({
      secret: admin.totp_secret,
      label: email,
      issuer: "Atakum Belediyesi",
      encoding: "base32",
    });
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, { margin: 1, width: 240 });
    const setupToken = signMfaSetupToken(admin.id);
    return res.json({
      success: 1,
      data: {
        mfaSetup: true,
        setupToken,
        qrDataUrl,
        otpauthUrl,
      },
      message: "Authenticator kurulumunu tamamlayın.",
    });
  } catch (err) {
    next(err);
  }
};

exports.completeTotpSetup = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: 0,
        message: "Sunucu yapılandırma hatası: güvenlik anahtarı tanımlı değil.",
      });
    }

    const { setupToken, code } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(setupToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: 0,
        message: "Kurulum oturumu geçersiz veya süresi dolmuş. Tekrar giriş yapın.",
      });
    }
    if (decoded.typ !== "mfa_setup" || !decoded.sub) {
      return res.status(401).json({ success: 0, message: "Geçersiz kurulum belirteci." });
    }

    const admin = await Admin.findByPk(decoded.sub);
    if (!admin || !admin.totp_secret) {
      return res.status(400).json({ success: 0, message: "İki faktörlü doğrulama kurulumu bulunamadı." });
    }
    if (admin.totp_enabled) {
      const token = signAccessToken(admin);
      await admin.update({ last_login: new Date() });
      return res.json({
        success: 1,
        data: { token },
        message: "Zaten etkin. Giriş yapıldı.",
      });
    }

    if (!verifyTotpCode(admin.totp_secret, code)) {
      return res.status(401).json({ success: 0, message: "Doğrulama kodu hatalı." });
    }

    await admin.update({ totp_enabled: true, last_login: new Date() });
    const token = signAccessToken(admin);
    res.json({ success: 1, data: { token }, message: "Authenticator etkinleştirildi." });
  } catch (err) {
    next(err);
  }
};

exports.verifyLoginTotp = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: 0,
        message: "Sunucu yapılandırma hatası: güvenlik anahtarı tanımlı değil.",
      });
    }

    const { challengeToken, code } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(challengeToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: 0,
        message: "Doğrulama oturumu geçersiz veya süresi dolmuş. Tekrar giriş yapın.",
      });
    }
    if (decoded.typ !== "mfa_challenge" || !decoded.sub) {
      return res.status(401).json({ success: 0, message: "Geçersiz doğrulama belirteci." });
    }

    const admin = await Admin.findByPk(decoded.sub);
    if (!admin || !admin.totp_enabled || !admin.totp_secret) {
      return res.status(400).json({ success: 0, message: "İki faktörlü doğrulama bu hesap için etkin değil." });
    }

    if (!verifyTotpCode(admin.totp_secret, code)) {
      return res.status(401).json({ success: 0, message: "Doğrulama kodu hatalı." });
    }

    await admin.update({ last_login: new Date() });
    const token = signAccessToken(admin);
    res.json({ success: 1, data: { token }, message: "Giriş başarılı." });
  } catch (err) {
    next(err);
  }
};

// Kayıt Et (Register)
// Sadece mevcut adminlerin erişebileceği bir fonksiyon
exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone_number, permissions, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      first_name,
      last_name,
      email,
      phone_number,
      role: role || "admin",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: normalizePermissions(permissions),
      last_login: new Date(),
    });

    const adminData = newAdmin.toJSON();
    delete adminData.password;
    delete adminData.totp_secret;

    res.status(201).json({
      success: 1,
      data: adminData,
      message: "Admin başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};
