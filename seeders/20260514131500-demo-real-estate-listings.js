"use strict";

const { Sequelize } = require("sequelize");
const IMG = require("./data/demoSeedImageUrls");

const TITLES = ["Satılık Belediye Arsası", "Kiralık Belediye İş Yeri"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Real_Estate_Listings", [
      {
        title: TITLES[0],
        description: "Atakum ilçesinde satılık arsa ilanıdır.",
        publish_date: "2026-06-12",
        is_active: true,
        files: JSON.stringify([IMG.HERO_3, "/uploads/real-estate/arsa-ornek.pdf"]),
      },
      {
        title: TITLES[1],
        description: "Merkezi konumda kiralık iş yeri ilanıdır.",
        publish_date: "2026-06-15",
        is_active: true,
        files: JSON.stringify([IMG.HERO_4, "/uploads/real-estate/isyeri-ornek.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Real_Estate_Listings", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
