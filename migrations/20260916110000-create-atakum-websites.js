"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AtakumWebsites", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      href: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      badge: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      kind: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "website",
      },
      section_key: {
        type: Sequelize.STRING(64),
        allowNull: false,
        defaultValue: "genel",
      },
      section_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("AtakumWebsites");
  },
};
