"use strict";

const TITLE = "2025-2029 Stratejik Plan";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Strategic_Plans", [
      {
        title: TITLE,
        description: "Orta vadeli stratejik hedefleri iceren plan dokumani.",
        publish_date: "2026-01-10",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2025-2029-stratejik-plan.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Strategic_Plans", { title: TITLE });
  },
};
