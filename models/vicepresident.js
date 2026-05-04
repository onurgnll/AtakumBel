"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VicePresident extends Model {
    static associate(models) {
      VicePresident.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
      });
    }
  }

  VicePresident.init(
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
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VicePresident",
      tableName: "Vice_Presidents",
      timestamps: false,
      underscored: true,
    },
  );

  return VicePresident;
};
