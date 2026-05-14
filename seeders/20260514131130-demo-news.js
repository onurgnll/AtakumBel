"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("News", [
      {
        title: C.NEWS_TITLE_SAHIL,
        spot: "Sahil bandinda yesil alan ve yaya akslari yenileniyor.",
        content:
          "Fen Isleri Mudurlugu koordinasyonunda sahil duzenleme projesi etaplar halinde hayata geciriliyor.",
        publish_date: now,
        is_active: true,
        view_count: 2450,
      },
      {
        title: C.NEWS_TITLE_SPOR,
        spot: "Cocuk ve gencler icin 8 farkli spor bransinda egitim verilecek.",
        content:
          "Kultur ve Sosyal Isler Mudurlugu tarafindan yaz doneminde spor etkinlikleri ilce geneline yayildi.",
        publish_date: now,
        is_active: true,
        view_count: 1780,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("News", {
      title: { [Sequelize.Op.in]: [C.NEWS_TITLE_SAHIL, C.NEWS_TITLE_SPOR] },
    });
  },
};
