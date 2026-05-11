"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AdminAuditLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Admins", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      method: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      status_code: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      duration_ms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ip: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("AdminAuditLogs", ["admin_id"]);
    await queryInterface.addIndex("AdminAuditLogs", ["createdAt"]);
    await queryInterface.addIndex("AdminAuditLogs", ["path"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("AdminAuditLogs");
  },
};
