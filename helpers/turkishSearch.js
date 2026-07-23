"use strict";

const { Op } = require("sequelize");

function turkishLower(value) {
  return String(value ?? "")
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR");
}

function escapeLikePattern(value) {
  return String(value ?? "").replace(/[%_\\]/g, "\\$&");
}

function turkishLowerColumn(sequelize, field) {
  let expr = sequelize.col(field);
  const replacements = [
    ["İ", "i"],
    ["I", "ı"],
    ["Ş", "ş"],
    ["Ğ", "ğ"],
    ["Ü", "ü"],
    ["Ö", "ö"],
    ["Ç", "ç"],
  ];

  for (const [from, to] of replacements) {
    expr = sequelize.fn("REPLACE", expr, from, to);
  }

  return sequelize.fn("LOWER", expr);
}

function buildTurkishLikeOr(fields, query, sequelize) {
  const pattern = `%${escapeLikePattern(turkishLower(query))}%`;

  return fields.map((field) =>
    sequelize.where(turkishLowerColumn(sequelize, field), {
      [Op.like]: pattern,
    }),
  );
}

module.exports = {
  turkishLower,
  buildTurkishLikeOr,
};
