"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Content_Popups", "layout", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "landscape",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Content_Popups", "layout");
  },
};
