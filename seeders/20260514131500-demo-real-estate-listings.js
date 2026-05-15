"use strict";

const { Sequelize } = require("sequelize");
const IMG = require("./data/demoSeedImageUrls");

const TITLES = ["Satılık Belediye Arsası", "Kiralık Belediye İş Yeri"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Publications", [
      {
        record_type: "real_estate_listing",
        title: TITLES[0],
        description: "Atakum ilçesinde satılık arsa ilanıdır.",
        publish_date: "2026-06-12",
        is_active: true,
        files: JSON.stringify([IMG.HERO_3, "/uploads/real-estate/arsa-ornek.pdf"]),
      },
      {
        record_type: "real_estate_listing",
        title: TITLES[1],
        description: "Merkezi konumda kiralık iş yeri ilanıdır.",
        publish_date: "2026-06-15",
        is_active: true,
        files: JSON.stringify([IMG.HERO_4, "/uploads/real-estate/isyeri-ornek.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Publications", {
      record_type: "real_estate_listing",
      title: { [Sequelize.Op.in]: TITLES },
    });
  },
};
