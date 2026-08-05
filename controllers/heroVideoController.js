"use strict";

const { HeroVideoSetting } = require("../models");
const {
  HERO_VIDEO_PRESETS,
  DEFAULT_PRESET_ID,
  findHeroVideoPreset,
  isValidHeroVideoPresetId,
} = require("../constants/heroVideoPresets");

const serializeSetting = (row) => {
  const preset = findHeroVideoPreset(row?.preset_id || DEFAULT_PRESET_ID);
  return {
    preset_id: preset.id,
    label: preset.label,
    desktop: preset.desktop,
    mobile: preset.mobile,
    poster: preset.poster,
    presets: HERO_VIDEO_PRESETS,
  };
};

const ensureSettingRow = async () => {
  await HeroVideoSetting.sync();
  const [row] = await HeroVideoSetting.findOrCreate({
    where: { id: 1 },
    defaults: { preset_id: DEFAULT_PRESET_ID },
  });
  return row;
};

exports.getSetting = async (req, res, next) => {
  try {
    const row = await ensureSettingRow();
    return res.json({
      success: 1,
      data: serializeSetting(row),
      message: "Ana sayfa hero video ayarı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const presetId =
      typeof req.body?.preset_id === "string"
        ? req.body.preset_id.trim()
        : "";

    if (!presetId || !isValidHeroVideoPresetId(presetId)) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Geçerli bir hero video seçimi gerekli.",
      });
    }

    const row = await ensureSettingRow();
    await row.update({ preset_id: presetId });

    return res.json({
      success: 1,
      data: serializeSetting(row),
      message: "Ana sayfa hero video ayarı güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};
