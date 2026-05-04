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
      PublicNotice.hasMany(models.Tender, {
        foreignKey: "notice_id",
        as: "tenders",
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("on_hold", "completed", "upcoming"),
        allowNull: false,
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
