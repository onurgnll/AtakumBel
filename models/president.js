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
      social_media_accounts: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      birth_place: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birth_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      grown_place: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      marital_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      education: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      political_career: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      work_life: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
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
