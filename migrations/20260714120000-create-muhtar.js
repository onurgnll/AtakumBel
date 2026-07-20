"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Muhtars", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      mahalle_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Muhtars");
  },
};
