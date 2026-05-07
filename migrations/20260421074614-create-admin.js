"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .describeTable("Admins")
      .then(() => true)
      .catch(() => false);

    if (!tableExists) {
      await queryInterface.createTable("Admins", {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        last_login: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        permissions: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
      return;
    }

    const table = await queryInterface.describeTable("Admins");

    if (!table.createdAt) {
      await queryInterface.addColumn("Admins", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      });
    }

    if (!table.updatedAt) {
      await queryInterface.addColumn("Admins", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Admins");
  },
};
