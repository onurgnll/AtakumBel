"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContentPopup extends Model {
    static associate() {}
  }

  ContentPopup.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      starts_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      ends_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      redirect_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ContentPopup",
      tableName: "Content_Popups",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return ContentPopup;
};
