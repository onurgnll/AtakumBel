"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CouncilDecision extends Model {
    static associate(models) {
      CouncilDecision.hasMany(models.PublicNotice, {
        foreignKey: "decision_id",
        as: "public_notices",
      });
    }
  }

  CouncilDecision.init(
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
        allowNull: true,
      },
      publish_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      files: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      decision_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      full_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CouncilDecision",
      tableName: "Council_Decisions",
      timestamps: false,
      underscored: true,
    },
  );

  return CouncilDecision;
};
