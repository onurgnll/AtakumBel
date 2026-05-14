"use strict";

const { Sequelize } = require("sequelize");

const TITLES = [
  "Yapi Kontrol ve Ruhsat Islemleri Yonergesi",
  "Sifir Atik Uygulama Yonergesi",
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Directives", [
      {
        title: TITLES[0],
        description:
          "Ruhsat basvurularinda belge kontrol surecini hizlandirmaya yonelik uygulama esaslarini belirler.",
        publish_date: "2026-02-15",
      },
      {
        title: TITLES[1],
        description:
          "Kamu binalari ve mahalle toplama noktalarinda atik ayristirma standartlarini tanimlar.",
        publish_date: "2026-03-20",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Directives", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
