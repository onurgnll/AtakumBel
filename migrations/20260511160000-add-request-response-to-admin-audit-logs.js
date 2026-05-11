"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("AdminAuditLogs");
    if (!table.request_body) {
      await queryInterface.addColumn("AdminAuditLogs", "request_body", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (!table.response_body) {
      await queryInterface.addColumn("AdminAuditLogs", "response_body", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("AdminAuditLogs");
    if (table.response_body) {
      await queryInterface.removeColumn("AdminAuditLogs", "response_body");
    }
    if (table.request_body) {
      await queryInterface.removeColumn("AdminAuditLogs", "request_body");
    }
  },
};
