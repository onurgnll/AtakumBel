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
    const table = "Mobile_App_Settings";
    if (!(await tableExists(queryInterface, table))) {
      await queryInterface.createTable(table, {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        android_url: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        ios_url: {
          type: Sequelize.STRING(500),
          allowNull: true,
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
          is_active: true,
          android_url: null,
          ios_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Mobile_App_Settings");
  },
};
