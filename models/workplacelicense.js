"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class WorkplaceLicense extends Model {
    static associate() {}
  }

  WorkplaceLicense.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      files: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "WorkplaceLicense",
      tableName: "Workplace_Licenses",
      timestamps: false,
      underscored: true,
    },
  );

  return WorkplaceLicense;
};
