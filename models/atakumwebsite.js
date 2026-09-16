"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AtakumWebsite extends Model {
    static associate() {}
  }

  AtakumWebsite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      href: {
        type: DataTypes.STRING(2000),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      badge: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      kind: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "website",
      },
      section_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: "genel",
      },
      section_title: {
        type: DataTypes.STRING(255),
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
      modelName: "AtakumWebsite",
      tableName: "AtakumWebsites",
      timestamps: false,
      underscored: true,
    },
  );

  return AtakumWebsite;
};
