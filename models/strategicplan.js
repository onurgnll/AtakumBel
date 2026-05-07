"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StrategicPlan extends Model {
    static associate(models) {}
  }

  StrategicPlan.init(
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      publish_date: { type: DataTypes.DATEONLY, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      files: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    },
    {
      sequelize,
      modelName: "StrategicPlan",
      tableName: "Strategic_Plans",
      timestamps: false,
      underscored: true,
    },
  );

  return StrategicPlan;
};

