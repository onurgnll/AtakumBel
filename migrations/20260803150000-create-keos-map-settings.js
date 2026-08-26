"use strict";

/** @type {import('sequelize-cli').Migration} */
async function tableExists(queryInterface, name) {
  const [[row]] = await queryInterface.sequelize.query(
    `SELECT to_regclass(:q) AS t`,
    { replacements: { q: `public."${name}"` } },
  );
  return row && row.t != null;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "Keos_Map_Settings";
    if (!(await tableExists(queryInterface, table))) {
      await queryInterface.createTable(table, {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        show_gathering_areas: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        show_waste_points: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        show_wifi_points: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        show_marketplaces: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      });
    }

    await queryInterface.bulkInsert(
      table,
      [
        {
          id: 1,
          show_gathering_areas: true,
          show_waste_points: true,
          show_wifi_points: true,
          show_marketplaces: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Keos_Map_Settings");
  },
};
