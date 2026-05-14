"use strict";

const TITLE = "2026 Mali Durum Beklenti Raporu";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Financial_Expectation_Reports", [
      {
        title: TITLE,
        description: "Gelir-gider beklentilerine iliskin mali degerlendirme raporu.",
        publish_date: "2026-02-10",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2026-mali-beklenti.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Financial_Expectation_Reports", { title: TITLE });
  },
};
