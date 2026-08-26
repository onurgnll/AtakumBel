"use strict";

/** @type {import('sequelize-cli').Migration} */
const TABLES = ["Publications", "Directives", "Events"];

async function columnExists(queryInterface, table, column) {
  const desc = await queryInterface.describeTable(table).catch(() => null);
  return Boolean(desc && desc[column]);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      if (await columnExists(queryInterface, table, "spot")) continue;
      await queryInterface.addColumn(table, "spot", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    for (const table of TABLES) {
      if (!(await columnExists(queryInterface, table, "spot"))) continue;
      await queryInterface.removeColumn(table, "spot");
    }
  },
};
