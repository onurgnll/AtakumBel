"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Encumen extends Model {
    static associate(models) {
      Encumen.hasMany(models.EncumenMembership, {
        foreignKey: "encumen_id",
        as: "memberships",
      });
    }
  }

  Encumen.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      term_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Encumen",
      tableName: "Encumens",
      timestamps: true,
      underscored: true,
    },
  );

  return Encumen;
};
