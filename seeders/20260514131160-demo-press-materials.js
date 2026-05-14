"use strict";

const { Sequelize } = require("sequelize");

const TITLES = ["Kurumsal Logo Paketi", "Basin Kiti 2026"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Press_Materials", [
      {
        title: TITLES[0],
        description: "Basin ve medya kullanimina uygun logo dosyalari.",
        publish_date: "2026-01-05",
        is_active: true,
        files: JSON.stringify(["/uploads/press/atakum-kurumsal-logo.png"]),
        file_url: "/uploads/press/atakum-kurumsal-logo.png",
      },
      {
        title: TITLES[1],
        description: "Kurumsal basin materyali arsivi.",
        publish_date: "2026-02-15",
        is_active: true,
        files: JSON.stringify(["/uploads/press/basin-kiti-2026.zip"]),
        file_url: "/uploads/press/basin-kiti-2026.zip",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Press_Materials", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
