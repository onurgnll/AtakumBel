"use strict";

const TITLE = "2025 Faaliyet Raporu";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Activity_Reports", [
      {
        title: TITLE,
        description: "Belediyenin 2025 yilinda gerceklestirdigi faaliyetlerin ozeti.",
        publish_date: "2026-01-15",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2025-faaliyet-raporu.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Activity_Reports", { title: TITLE });
  },
};
