"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.VicePresident, {
        foreignKey: "department_id",
        as: "legacy_vice_presidents",
      });
      Department.hasMany(models.Employee, {
        foreignKey: "department_id",
        as: "employees",
      });
      Department.hasMany(models.Employee, {
        foreignKey: "department_id",
        as: "contact_personnel",
      });
      Department.belongsTo(models.Employee, {
        foreignKey: "manager_employee_id",
        as: "manager",
      });
      Department.belongsToMany(models.VicePresident, {
        through: models.VicePresidentDepartment,
        foreignKey: "department_id",
        otherKey: "vice_president_id",
        as: "vice_presidents",
      });
      Department.hasMany(models.PublicNotice, {
        foreignKey: "department_id",
        as: "public_notices",
      });
    }
  }

  Department.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      manager_employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "Departments",
      timestamps: false,
      underscored: true,
    },
  );

  return Department;
};
