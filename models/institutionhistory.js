"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InstitutionHistory extends Model {
    static associate() {}
  }

  InstitutionHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      presidents: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      timeline: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "InstitutionHistory",
      tableName: "Institution_Histories",
      timestamps: false,
      underscored: true,
    },
  );

  return InstitutionHistory;
};
