"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PressMaterial extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  PressMaterial.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      publish_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      files: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PressMaterial",
      tableName: "Press_Materials",
      timestamps: false,
      underscored: true,
    },
  );

  return PressMaterial;
};
