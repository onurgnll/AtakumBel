"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PressReleaseGallery extends Model {
    static associate(models) {
      PressReleaseGallery.belongsTo(models.PressRelease, {
        foreignKey: "press_release_id",
        as: "press_release",
      });
    }
  }

  PressReleaseGallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      press_release_id: { type: DataTypes.INTEGER, allowNull: false },
      image_url: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false },
      is_main: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: "PressReleaseGallery",
      tableName: "Press_Release_Galleries",
      timestamps: false,
      underscored: true,
    },
  );

  return PressReleaseGallery;
};
