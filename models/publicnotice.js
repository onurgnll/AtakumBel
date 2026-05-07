"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PublicNotice extends Model {
    static associate(models) {
      PublicNotice.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
      });
      PublicNotice.belongsTo(models.CouncilDecision, {
        foreignKey: "decision_id",
        as: "decision",
      });
    }
  }

  PublicNotice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      publish_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      files: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("on_hold", "completed", "upcoming"),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      decision_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PublicNotice",
      tableName: "Public_Notices",
      timestamps: false,
      underscored: true,
    },
  );

  return PublicNotice;
};
