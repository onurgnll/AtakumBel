"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GatheringArea extends Model {
    static associate(models) {}
  }

  GatheringArea.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GatheringArea",
      tableName: "GatheringAreas",
      timestamps: false,
      underscored: true,
    },
  );

  return GatheringArea;
};

