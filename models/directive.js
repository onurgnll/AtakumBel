"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Directive extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  Directive.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publish_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Directive",
      tableName: "Directives",
      timestamps: false,
      underscored: true,
    },
  );

  return Directive;
};
