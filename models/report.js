"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  Report.init(
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
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          "activity",
          "financial",
          "performance",
          "audit",
          "strategic",
          "kvkk",
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "Reports",
      timestamps: false,
      underscored: true,
    },
  );

  return Report;
};
