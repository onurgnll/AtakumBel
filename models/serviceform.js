"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServiceForm extends Model {
    static associate(models) {
      ServiceForm.belongsTo(models.Service, {
        foreignKey: "service_id",
        as: "service",
      });
    }
  }

  ServiceForm.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      form_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ServiceForm",
      tableName: "Service_Forms",
      timestamps: false,
      underscored: true,
    },
  );

  return ServiceForm;
};
