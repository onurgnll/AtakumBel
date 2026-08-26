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
    const table = "Hero_Video_Settings";
    if (!(await tableExists(queryInterface, table))) {
      await queryInterface.createTable(table, {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        preset_id: {
          type: Sequelize.STRING(64),
          allowNull: false,
          defaultValue: "video-1",
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
          preset_id: "video-1",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Hero_Video_Settings");
  },
};
