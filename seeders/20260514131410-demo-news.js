"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { newsIdByTitle } = require("./lib/seedHelpers");
const IMG = require("./data/demoSeedImageUrls");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("News", [
      {
        title: C.NEWS_TITLE_SAHIL,
        spot: "Sahil bandında yeşil alan ve yaya aksları yenileniyor.",
        content:
          "Fen İşleri Müdürlüğü koordinasyonunda sahil düzenleme projesi etaplar halinde hayata geçiriliyor.",
        publish_date: now,
        is_active: true,
        view_count: 2450,
      },
      {
        title: C.NEWS_TITLE_SPOR,
        spot: "Çocuk ve gençler için 8 farklı spor branşında eğitim verilecek.",
        content:
          "Kültür ve Sosyal İşler Müdürlüğü tarafından yaz döneminde spor etkinlikleri ilçe geneline yayıldı.",
        publish_date: now,
        is_active: true,
        view_count: 1780,
      },
    ]);

    const nSahil = await newsIdByTitle(queryInterface, C.NEWS_TITLE_SAHIL);
    const nSpor = await newsIdByTitle(queryInterface, C.NEWS_TITLE_SPOR);
    await queryInterface.bulkInsert("News_Galleries", [
      { news_id: nSahil, image_url: IMG.HERO_1, order: 1, is_main: true },
      { news_id: nSahil, image_url: IMG.HERO_3, order: 2, is_main: false },
      { news_id: nSpor, image_url: IMG.HERO_2, order: 1, is_main: true },
      { news_id: nSpor, image_url: IMG.HERO_4, order: 2, is_main: false },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("News", {
      title: { [Sequelize.Op.in]: [C.NEWS_TITLE_SAHIL, C.NEWS_TITLE_SPOR] },
    });
  },
};
