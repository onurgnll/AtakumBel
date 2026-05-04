"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CouncilMember extends Model {
    static associate(models) {
      CouncilMember.belongsTo(models.Council, {
        foreignKey: "council_id",
        as: "council",
      });
    }
  }

  CouncilMember.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      political_party: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      council_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CouncilMember",
      tableName: "Council_Members",
      timestamps: false,
      underscored: true,
    },
  );

  return CouncilMember;
};
