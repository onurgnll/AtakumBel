"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Councils", "term_name", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "2024-2029 Dönemi",
    });

    await queryInterface.addColumn("Councils", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Councils", "term_name");
    await queryInterface.removeColumn("Councils", "is_active");
  },
};
