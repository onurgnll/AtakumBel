"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Muhtar extends Model {
    static associate(models) {}
  }

  Muhtar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      mahalle_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Muhtar",
      tableName: "Muhtars",
      timestamps: false,
      underscored: true,
    },
  );

  return Muhtar;
};
