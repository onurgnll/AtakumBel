"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HeroVideoSetting extends Model {
    static associate() {}
  }

  HeroVideoSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      preset_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "video-1",
      },
    },
    {
      sequelize,
      modelName: "HeroVideoSetting",
      tableName: "Hero_Video_Settings",
      timestamps: true,
      underscored: true,
    },
  );

  return HeroVideoSetting;
};
