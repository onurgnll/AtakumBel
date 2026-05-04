"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CouncilDecision extends Model {
    static associate(models) {
      CouncilDecision.belongsTo(models.Council, {
        foreignKey: "council_id",
        as: "council",
      });
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
      decision_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      full_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      council_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
