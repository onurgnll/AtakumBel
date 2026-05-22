"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PressRelease extends Model {
    static associate(models) {
      PressRelease.hasMany(models.PressReleaseGallery, {
        foreignKey: "press_release_id",
        as: "gallery",
      });
    }
  }

  PressRelease.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      spot: { type: DataTypes.TEXT, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      publish_date: { type: DataTypes.DATE, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false },
      view_count: { type: DataTypes.INTEGER, allowNull: false },
      files: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    },
    {
      sequelize,
      modelName: "PressRelease",
      tableName: "Press_Releases",
      timestamps: false,
      underscored: true,
    },
  );

  return PressRelease;
};
