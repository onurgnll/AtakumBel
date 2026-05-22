"use strict";

async function backfillOrder(queryInterface, tableName) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT id FROM "${tableName}" ORDER BY id ASC`,
  );
  for (let i = 0; i < rows.length; i++) {
    await queryInterface.bulkUpdate(tableName, { order: i + 1 }, { id: rows[i].id });
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Vice_Presidents", "order", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Council_Members", "order", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await backfillOrder(queryInterface, "Vice_Presidents");
    await backfillOrder(queryInterface, "Council_Members");
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Vice_Presidents", "order");
    await queryInterface.removeColumn("Council_Members", "order");
  },
};
