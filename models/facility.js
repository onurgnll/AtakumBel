"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Facility extends Model {
    static associate(models) {
      Facility.hasMany(models.FacilityGallery, {
        foreignKey: "facility_id",
        as: "gallery",
      });
    }
  }

  Facility.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Facility",
      tableName: "Facilities",
      timestamps: false,
      underscored: true,
    },
  );

  return Facility;
};
