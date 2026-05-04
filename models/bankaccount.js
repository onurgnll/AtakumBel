"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BankAccount extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  BankAccount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      iban: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BankAccount",
      tableName: "Bank_Accounts",
      timestamps: false,
      underscored: true,
    },
  );

  return BankAccount;
};
