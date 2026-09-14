"use strict";

function parseOptionalInt(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function createMainIndex(body, uploadCount) {
  if (!uploadCount) return 0;
  const idx = parseOptionalInt(body?.main_image_index);
  if (idx == null || idx < 0 || idx >= uploadCount) return 0;
  return idx;
}

function parseCoverChoice(body, uploadCount) {
  const mainGalleryId = parseOptionalInt(body?.main_gallery_id);
  const mainImageIndex = parseOptionalInt(body?.main_image_index);
  const coverFromNew =
    mainImageIndex != null &&
    mainImageIndex >= 0 &&
    mainImageIndex < uploadCount;
  return { mainGalleryId, mainImageIndex, coverFromNew };
}

async function setExistingAsMain(model, fkField, fkValue, galleryId, transaction) {
  if (galleryId == null) return;
  await model.update(
    { is_main: false },
    { where: { [fkField]: fkValue }, transaction },
  );
  await model.update(
    { is_main: true },
    { where: { id: galleryId, [fkField]: fkValue }, transaction },
  );
}

async function promoteFirstIfNoMain(model, fkField, fkValue, transaction) {
  const remaining = await model.findAll({
    where: { [fkField]: fkValue },
    order: [["order", "ASC"]],
    transaction,
  });
  if (!remaining.length) return;
  if (remaining.some((row) => row.is_main)) return;
  remaining[0].is_main = true;
  await remaining[0].save({ transaction });
}

module.exports = {
  parseOptionalInt,
  createMainIndex,
  parseCoverChoice,
  setExistingAsMain,
  promoteFirstIfNoMain,
};
