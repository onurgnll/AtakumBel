"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Council extends Model {
    static associate(models) {
      Council.hasMany(models.CouncilMember, {
        foreignKey: "council_id",
        as: "members",
      });
      Council.hasMany(models.CouncilDecision, {
        foreignKey: "council_id",
        as: "decisions",
      });
    }
  }

  Council.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      term_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Council",
      tableName: "Councils",
      timestamps: false,
      underscored: false,
    },
  );

  return Council;
};
