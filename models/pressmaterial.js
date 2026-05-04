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
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
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
