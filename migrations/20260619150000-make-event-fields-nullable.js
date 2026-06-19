"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Events", "start_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.changeColumn("Events", "end_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.changeColumn("Events", "event_time", {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.changeColumn("Events", "address", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Events", "start_date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.changeColumn("Events", "end_date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.changeColumn("Events", "event_time", {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn("Events", "address", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
