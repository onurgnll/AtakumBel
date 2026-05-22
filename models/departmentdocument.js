"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class DepartmentDocument extends Model {
    static associate(models) {
      DepartmentDocument.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
      });
    }
  }

  DepartmentDocument.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      department_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      publish_date: { type: DataTypes.DATEONLY, allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      files: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    },
    {
      sequelize,
      modelName: "DepartmentDocument",
      tableName: "Department_Documents",
      timestamps: false,
      underscored: true,
    },
  );

  return DepartmentDocument;
};
