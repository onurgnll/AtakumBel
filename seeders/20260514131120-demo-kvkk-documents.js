"use strict";

const TITLE = "KVKK Aydinlatma Metni";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Kvkk_Documents", [
      {
        title: TITLE,
        description: "Kisisel verilerin islenmesine iliskin bilgilendirme metni.",
        publish_date: "2026-02-01",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/kvkk-aydinlatma-metni.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Kvkk_Documents", { title: TITLE });
  },
};
