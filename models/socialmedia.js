"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  SocialMedia.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      platform_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SocialMedia",
      tableName: "Social_Medias",
      timestamps: false,
      underscored: true,
    },
  );

  return SocialMedia;
};
