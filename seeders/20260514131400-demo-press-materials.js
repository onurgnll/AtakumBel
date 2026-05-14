"use strict";

const { Sequelize } = require("sequelize");
const IMG = require("./data/demoSeedImageUrls");

const TITLES = ["Kurumsal Logo Paketi", "Basın Kiti 2026"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Press_Materials", [
      {
        title: TITLES[0],
        description: "Basın ve medya kullanımına uygun logo dosyaları.",
        publish_date: "2026-01-05",
        is_active: true,
        files: JSON.stringify([IMG.PRESS_LOGO]),
        file_url: IMG.PRESS_LOGO,
      },
      {
        title: TITLES[1],
        description: "Kurumsal basın materyali arşivi.",
        publish_date: "2026-02-15",
        is_active: true,
        files: JSON.stringify([IMG.HERO_2, "/uploads/press/basin-kiti-2026.zip"]),
        file_url: IMG.HERO_2,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Press_Materials", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
