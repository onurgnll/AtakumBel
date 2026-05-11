"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Departments");
    if (table.phone) {
      await queryInterface.removeColumn("Departments", "phone");
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Departments");
    if (!table.phone) {
      await queryInterface.addColumn("Departments", "phone", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
