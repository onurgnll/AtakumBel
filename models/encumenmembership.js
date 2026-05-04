"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EncumenMembership extends Model {
    static associate(models) {
      EncumenMembership.belongsTo(models.Encumen, {
        foreignKey: "encumen_id",
        as: "encumen",
      });
      EncumenMembership.belongsTo(models.Employee, {
        foreignKey: "member_id",
        constraints: false,
        as: "employee",
      });

      EncumenMembership.belongsTo(models.CouncilMember, {
        foreignKey: "member_id",
        constraints: false,
        as: "council_member",
      });
    }
  }

  EncumenMembership.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      encumen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      member_type: {
        type: DataTypes.ENUM("staff", "council_member"),
        allowNull: false,
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EncumenMembership",
      tableName: "Encumen_Memberships",
      timestamps: false,
      underscored: true,
    },
  );

  return EncumenMembership;
};
