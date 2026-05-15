"use strict";

const { sequelize } = require("../models");

/** PostgreSQL: kayıttaki en güncel tarih (bitiş > karar > başlangıç > yayın) */
const SORT_DATE_SQL = `GREATEST(
  "Publication"."end_date",
  "Publication"."date",
  "Publication"."start_date",
  "Publication"."publish_date"
)`;

const sortDateLiteral = () => sequelize.literal(SORT_DATE_SQL);

/** API yanıtı için sort_date (YYYY-MM-DD veya null) */
function pickSortDate(row) {
  const candidates = [row.end_date, row.date, row.start_date, row.publish_date].filter(Boolean);
  if (!candidates.length) return null;
  return candidates.sort().pop();
}

module.exports = {
  SORT_DATE_SQL,
  sortDateLiteral,
  pickSortDate,
};
