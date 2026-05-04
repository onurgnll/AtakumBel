"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class President extends Model {
    static associate(models) {
      President.hasMany(models.PresidentGallery, {
        foreignKey: "president_id",
        as: "gallery",
      });
    }
  }

  President.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      president_image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "President",
      tableName: "Presidents",
      timestamps: false,
      underscored: true,
    },
  );

  return President;
};
