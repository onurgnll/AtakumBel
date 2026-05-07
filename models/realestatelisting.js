"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RealEstateListing extends Model {
    static associate(models) {}
  }

  RealEstateListing.init(
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
    },
    {
      sequelize,
      modelName: "RealEstateListing",
      tableName: "Real_Estate_Listings",
      timestamps: false,
      underscored: true,
    },
  );

  return RealEstateListing;
};

