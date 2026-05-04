"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Suggestion extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  Suggestion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      application_duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_budget: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      stakeholders: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      beneficiaries: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      main_activities: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expected_results: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "reviewed", "completed"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Suggestion",
      tableName: "Suggestions",
      timestamps: false,
      underscored: true,
    },
  );

  return Suggestion;
};
