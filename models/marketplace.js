"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Marketplace extends Model {
    static associate(models) {}
  }

  Marketplace.init(
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
      day_of_week: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Marketplace",
      tableName: "Marketplaces",
      timestamps: false,
      underscored: true,
    },
  );

  return Marketplace;
};

