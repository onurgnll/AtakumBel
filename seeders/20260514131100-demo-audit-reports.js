"use strict";

const TITLE = "2025 Ic Denetim Raporu";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Audit_Reports", [
      {
        title: TITLE,
        description: "Ic denetim surecleri ve bulgularin ozet raporu.",
        publish_date: "2026-03-05",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2025-ic-denetim.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Audit_Reports", { title: TITLE });
  },
};
