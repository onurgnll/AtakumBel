"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MobileAppSetting extends Model {
    static associate() {}
  }

  MobileAppSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      android_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      ios_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MobileAppSetting",
      tableName: "Mobile_App_Settings",
      timestamps: true,
      underscored: true,
    },
  );

  return MobileAppSetting;
};
