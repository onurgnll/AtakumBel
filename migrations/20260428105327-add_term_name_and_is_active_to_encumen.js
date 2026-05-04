"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Encumens", "term_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Encumens", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    // Timestamps kapalıysa ve açmak istersen bunları da ekleyebilirsin:
    await queryInterface.addColumn("Encumens", "created_at", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now"),
    });
    await queryInterface.addColumn("Encumens", "updated_at", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("now"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Encumens", "term_name");
    await queryInterface.removeColumn("Encumens", "is_active");
    await queryInterface.removeColumn("Encumens", "created_at");
    await queryInterface.removeColumn("Encumens", "updated_at");
  },
};
