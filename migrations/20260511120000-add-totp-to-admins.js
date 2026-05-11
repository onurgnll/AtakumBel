"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Admins");
    if (!table.totp_secret) {
      await queryInterface.addColumn("Admins", "totp_secret", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.totp_enabled) {
      await queryInterface.addColumn("Admins", "totp_enabled", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("Admins");
    if (table.totp_enabled) {
      await queryInterface.removeColumn("Admins", "totp_enabled");
    }
    if (table.totp_secret) {
      await queryInterface.removeColumn("Admins", "totp_secret");
    }
  },
};
