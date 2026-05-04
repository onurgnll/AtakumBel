"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FacilityGallery extends Model {
    static associate(models) {
      FacilityGallery.belongsTo(models.Facility, {
        foreignKey: "facility_id",
        as: "facility",
      });
    }
  }

  FacilityGallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_main: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "FacilityGallery",
      tableName: "Facility_Galleries",
      timestamps: false,
      underscored: true,
    },
  );

  return FacilityGallery;
};
