"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PresidentGallery extends Model {
    static associate(models) {
      PresidentGallery.belongsTo(models.President, {
        foreignKey: "president_id",
        as: "president",
      });
    }
  }

  PresidentGallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      president_id: {
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
      modelName: "PresidentGallery",
      tableName: "President_Galleries",
      timestamps: false,
      underscored: true,
    },
  );

  return PresidentGallery;
};
