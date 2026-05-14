"use strict";

const TITLE = "2026 Performans Programi";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Performance_Programs", [
      {
        title: TITLE,
        description: "Yillik performans hedefleri ve olcum gostergeleri.",
        publish_date: "2026-02-20",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2026-performans-programi.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Performance_Programs", { title: TITLE });
  },
};
