"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AdminAuditLog extends Model {
    static associate(models) {
      AdminAuditLog.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  AdminAuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      method: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING(2000),
        allowNull: false,
      },
      status_code: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      duration_ms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      request_body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      response_body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AdminAuditLog",
      tableName: "AdminAuditLogs",
      timestamps: true,
      updatedAt: false,
    },
  );

  return AdminAuditLog;
};
