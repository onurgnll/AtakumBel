"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VicePresident extends Model {
    static associate(models) {
      VicePresident.belongsToMany(models.Department, {
        through: models.VicePresidentDepartment,
        foreignKey: "vice_president_id",
        otherKey: "department_id",
        as: "departments",
      });
      VicePresident.hasMany(models.VicePresidentDepartment, {
        foreignKey: "vice_president_id",
        as: "department_relations",
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
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
