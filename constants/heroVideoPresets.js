"use strict";

/** WebFront `public/videos` altındaki statik dosyalarla eşleşir. */
const HERO_VIDEO_PRESETS = [
  {
    id: "video-1",
    label: "1. Video",
    desktop: "/videos/slider_day3_desktop.mp4",
    mobile: "/videos/slider_day3_mobile.mp4",
    poster: "/videos/slider_day3_hero_poster.webp",
  },
  {
    id: "video-2",
    label: "2. Video",
    desktop: "/videos/slider_day2_4k_web.mp4",
    mobile: "/videos/slider_day2_1080_web.mp4",
    poster: "/videos/slider_day2_hero_poster.webp",
  },
];

const DEFAULT_PRESET_ID = HERO_VIDEO_PRESETS[0].id;

function findHeroVideoPreset(presetId) {
  return (
    HERO_VIDEO_PRESETS.find((preset) => preset.id === presetId) ||
    HERO_VIDEO_PRESETS[0]
  );
}

function isValidHeroVideoPresetId(presetId) {
  return HERO_VIDEO_PRESETS.some((preset) => preset.id === presetId);
}

module.exports = {
  HERO_VIDEO_PRESETS,
  DEFAULT_PRESET_ID,
  findHeroVideoPreset,
  isValidHeroVideoPresetId,
};
