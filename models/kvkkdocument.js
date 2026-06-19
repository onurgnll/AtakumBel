"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class KvkkDocument extends Model {
    static associate(models) {}
  }

  KvkkDocument.init(
    {
      id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      publish_date: { type: DataTypes.DATEONLY, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      files: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
      link: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
      sequelize,
      modelName: "KvkkDocument",
      tableName: "Kvkk_Documents",
      timestamps: false,
      underscored: true,
    },
  );

  return KvkkDocument;
};

