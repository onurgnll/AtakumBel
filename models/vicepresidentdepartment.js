"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VicePresidentDepartment extends Model {
    static associate(models) {
      VicePresidentDepartment.belongsTo(models.VicePresident, {
        foreignKey: "vice_president_id",
        as: "vice_president",
      });
      VicePresidentDepartment.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
      });
    }
  }

  VicePresidentDepartment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      vice_president_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "VicePresidentDepartment",
      tableName: "Vice_President_Departments",
      underscored: true,
    },
  );

  return VicePresidentDepartment;
};
