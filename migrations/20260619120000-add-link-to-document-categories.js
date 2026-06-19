"use strict";

const TABLES = [
  "Press_Materials",
  "Kvkk_Documents",
  "Activity_Reports",
  "Audit_Reports",
  "Financial_Expectation_Reports",
  "Performance_Programs",
  "Strategic_Plans",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.addColumn(table, "link", {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    for (const table of TABLES) {
      await queryInterface.removeColumn(table, "link");
    }
  },
};
