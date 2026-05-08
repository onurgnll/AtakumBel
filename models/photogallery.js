"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PhotoGallery extends Model {
    static associate() {}
  }

  PhotoGallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "PhotoGallery",
      tableName: "Photo_Galleries",
      underscored: true,
    },
  );

  return PhotoGallery;
};
