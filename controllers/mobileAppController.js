"use strict";

const { MobileAppSetting } = require("../models");

const DEFAULT_SETTING = {
  is_active: true,
  android_url: null,
  ios_url: null,
};

const toBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "evet", "aktif"].includes(normalized)) return true;
  if (["false", "0", "hayir", "hayır", "pasif"].includes(normalized)) {
    return false;
  }
  return undefined;
};

const normalizeUrl = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 500);
};

const serializeSetting = (row) => ({
  is_active: Boolean(row?.is_active ?? true),
  android_url: row?.android_url ? String(row.android_url) : null,
  ios_url: row?.ios_url ? String(row.ios_url) : null,
});

const ensureSettingRow = async () => {
  await MobileAppSetting.sync();
  const [row] = await MobileAppSetting.findOrCreate({
    where: { id: 1 },
    defaults: DEFAULT_SETTING,
  });
  return row;
};

exports.getSetting = async (req, res, next) => {
  try {
    const row = await ensureSettingRow();
    return res.json({
      success: 1,
      data: serializeSetting(row),
      message: "Mobil uygulama ayarı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const row = await ensureSettingRow();
    const patch = {};

    if (req.body?.is_active !== undefined) {
      const parsed = toBoolean(req.body.is_active);
      if (parsed === undefined) {
        return res.status(400).json({
          success: 0,
          data: null,
          message: "is_active için geçerli bir boolean değer gerekli.",
        });
      }
      patch.is_active = parsed;
    }

    if (req.body?.android_url !== undefined) {
      patch.android_url = normalizeUrl(req.body.android_url);
    }

    if (req.body?.ios_url !== undefined) {
      patch.ios_url = normalizeUrl(req.body.ios_url);
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Güncellenecek mobil uygulama alanı gönderilmedi.",
      });
    }

    await row.update(patch);
    await row.reload();

    return res.json({
      success: 1,
      data: serializeSetting(row),
      message: "Mobil uygulama ayarı güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};
