"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PerformanceProgram extends Model {
    static associate(models) {}
  }

  PerformanceProgram.init(
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      publish_date: { type: DataTypes.DATEONLY, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      files: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
      link: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
      sequelize,
      modelName: "PerformanceProgram",
      tableName: "Performance_Programs",
      timestamps: false,
      underscored: true,
    },
  );

  return PerformanceProgram;
};

