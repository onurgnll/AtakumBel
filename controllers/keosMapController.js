"use strict";

const { KeosMapSetting } = require("../models");
const {
  QUERY_NAMES,
  PRIMARY_KEYS,
  queryGeoJson,
} = require("../services/keosGisService");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

const DEFAULT_PAGE_COUNT = 500;
const MAX_PAGE_COUNT = 9999;

const VISIBILITY_FIELDS = [
  "show_gathering_areas",
  "show_waste_points",
  "show_wifi_points",
  "show_marketplaces",
];

const DEFAULT_VISIBILITY = {
  show_gathering_areas: true,
  show_waste_points: true,
  show_wifi_points: true,
  show_marketplaces: true,
};

const toBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "evet", "aktif"].includes(normalized)) return true;
  if (["false", "0", "hayir", "hayır", "pasif"].includes(normalized))
    return false;
  return undefined;
};

const serializeVisibility = (row) => ({
  show_gathering_areas: Boolean(row?.show_gathering_areas ?? true),
  show_waste_points: Boolean(row?.show_waste_points ?? true),
  show_wifi_points: Boolean(row?.show_wifi_points ?? true),
  show_marketplaces: Boolean(row?.show_marketplaces ?? true),
});

const ensureVisibilityRow = async () => {
  // sequelize-cli olmadan da lokal/dev'de tablonun oluşmasını sağlar
  await KeosMapSetting.sync();
  const [row] = await KeosMapSetting.findOrCreate({
    where: { id: 1 },
    defaults: DEFAULT_VISIBILITY,
  });
  return row;
};

const buildFeatureItem = (feature, row) => {
  const item = {
    geometryKey: feature.geometryKey,
    geometry: feature.geometry,
    properties: feature.properties,
    centroid: feature.centroid,
    interiorPoint: feature.interiorPoint,
    bbox: feature.bbox,
  };

  if (row?.Cells?.length) {
    item.fields = row.Cells.reduce((acc, cell) => {
      const key = cell.ColumnName || cell.Path;
      if (key) {
        acc[key] = cell.Value ?? cell.DisplayText ?? null;
      }
      return acc;
    }, {});
  }

  return item;
};

const simplifyResponse = (raw) => {
  const rowsByKey = new Map(
    (raw?.rows || []).map((row) => [row.geometryKey, row]),
  );

  const items = (raw?.features || []).map((feature) =>
    buildFeatureItem(feature, rowsByKey.get(feature.geometryKey)),
  );

  return {
    geojson: {
      type: raw?.type || "FeatureCollection",
      features: raw?.features || [],
      bbox: raw?.bbox,
    },
    columns: raw?.columns || [],
    items,
    primaryKey: raw?.PrimaryKey,
    total_returned: items.length,
  };
};

const runQuery = async ({ queryName, filter, page, per_page }) => {
  const { limit, offset } = getPaginationParams(page, per_page);
  const pageCount = per_page ? limit : DEFAULT_PAGE_COUNT;

  const raw = await queryGeoJson({
    queryName,
    filter,
    pageCount: Math.min(pageCount, MAX_PAGE_COUNT),
    startReadIndex: offset,
  });

  return { data: simplifyResponse(raw), limit, offset };
};

exports.getWastePoints = async (req, res, next) => {
  try {
    const active = toBoolean(req.query.active);
    const filter =
      active === undefined
        ? undefined
        : `geosifiratik.geo_durum = ${active ? "true" : "false"}`;

    const { data, limit, offset } = await runQuery({
      queryName: QUERY_NAMES.WASTE_POINTS,
      filter,
      page: req.query.page,
      per_page: req.query.per_page,
    });

    return res.json({
      success: 1,
      data: {
        ...data,
        pagination: getPagingData(data.total_returned, req.query.page, limit),
      },
      message: "Atık noktaları (KEOS) listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getWastePointById = async (req, res, next) => {
  try {
    const filter = `${PRIMARY_KEYS.WASTE_POINTS} = ${Number(req.params.id)}`;
    const raw = await queryGeoJson({
      queryName: QUERY_NAMES.WASTE_POINTS,
      filter,
      pageCount: 1,
      startReadIndex: 0,
    });

    const data = simplifyResponse(raw);
    if (!data.items.length) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Atık noktası bulunamadı.",
      });
    }

    return res.json({
      success: 1,
      data: { ...data.items[0], columns: data.columns },
      message: "Atık noktası detayı (KEOS) getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getGatheringAreas = async (req, res, next) => {
  try {
    const { data, limit, offset } = await runQuery({
      queryName: QUERY_NAMES.GATHERING_AREAS,
      page: req.query.page,
      per_page: req.query.per_page,
    });

    return res.json({
      success: 1,
      data: {
        ...data,
        pagination: getPagingData(data.total_returned, req.query.page, limit),
      },
      message: "Afet toplanma alanları (KEOS) listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getGatheringAreaById = async (req, res, next) => {
  try {
    const filter = `${PRIMARY_KEYS.GATHERING_AREAS} = ${Number(req.params.id)}`;
    const raw = await queryGeoJson({
      queryName: QUERY_NAMES.GATHERING_AREAS,
      filter,
      pageCount: 1,
      startReadIndex: 0,
    });

    const data = simplifyResponse(raw);
    if (!data.items.length) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Afet toplanma alanı bulunamadı.",
      });
    }

    return res.json({
      success: 1,
      data: { ...data.items[0], columns: data.columns },
      message: "Afet toplanma alanı detayı (KEOS) getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getVisibility = async (req, res, next) => {
  try {
    const row = await ensureVisibilityRow();
    return res.json({
      success: 1,
      data: serializeVisibility(row),
      message: "KEOS haritası görünürlük ayarları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateVisibility = async (req, res, next) => {
  try {
    const row = await ensureVisibilityRow();
    const patch = {};

    for (const field of VISIBILITY_FIELDS) {
      if (req.body[field] === undefined) continue;
      const parsed = toBoolean(req.body[field]);
      if (parsed === undefined) {
        return res.status(400).json({
          success: 0,
          data: null,
          message: `${field} için geçerli bir boolean değer gerekli.`,
        });
      }
      patch[field] = parsed;
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Güncellenecek görünürlük alanı gönderilmedi.",
      });
    }

    await row.update(patch);

    return res.json({
      success: 1,
      data: serializeVisibility(row),
      message: "KEOS haritası görünürlük ayarları güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};
