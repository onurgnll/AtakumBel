"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class KeosMapSetting extends Model {
    static associate() {}
  }

  KeosMapSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      show_gathering_areas: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      show_waste_points: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      show_wifi_points: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      show_marketplaces: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "KeosMapSetting",
      tableName: "Keos_Map_Settings",
      timestamps: true,
      underscored: true,
    },
  );

  return KeosMapSetting;
};
