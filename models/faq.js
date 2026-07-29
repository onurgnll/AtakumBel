"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  Faq.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Faq",
      tableName: "Faqs",
      timestamps: false,
      underscored: true,
    },
  );

  return Faq;
};
