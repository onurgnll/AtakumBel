"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NewsGallery extends Model {
    static associate(models) {
      NewsGallery.belongsTo(models.News, { foreignKey: "news_id", as: "news" });
    }
  }

  NewsGallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      news_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_main: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "NewsGallery",
      tableName: "News_Galleries",
      timestamps: false,
      underscored: true,
    },
  );

  return NewsGallery;
};
