"use strict";

const categoryColumns = (Sequelize) => ({
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, allowNull: true },
  publish_date: { type: Sequelize.DATEONLY, allowNull: true },
  is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  files: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Workplace_Licenses", categoryColumns(Sequelize));
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Workplace_Licenses");
  },
};
