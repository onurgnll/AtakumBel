"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventGallery extends Model {
    static associate(models) {
      EventGallery.belongsTo(models.Event, {
        foreignKey: "event_id",
        as: "event",
      });
    }
  }

  EventGallery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      event_id: {
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
      modelName: "EventGallery",
      tableName: "Event_Galleries",
      timestamps: false,
      underscored: true,
    },
  );

  return EventGallery;
};
