"use strict";
const { Model } = require("sequelize");

/** @typedef {'public_notice'|'tender'|'council_decision'|'real_estate_listing'} PublicationRecordType */

const RECORD_TYPES = Object.freeze({
  PUBLIC_NOTICE: "public_notice",
  TENDER: "tender",
  COUNCIL_DECISION: "council_decision",
  REAL_ESTATE_LISTING: "real_estate_listing",
});

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static RECORD_TYPES = RECORD_TYPES;

    static associate(models) {
      Publication.belongsTo(models.Department, {
        foreignKey: "department_id",
        as: "department",
      });
    }
  }

  Publication.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      record_type: {
        type: DataTypes.ENUM(
          RECORD_TYPES.PUBLIC_NOTICE,
          RECORD_TYPES.TENDER,
          RECORD_TYPES.COUNCIL_DECISION,
          RECORD_TYPES.REAL_ESTATE_LISTING,
        ),
        allowNull: false,
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
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("on_hold", "completed", "upcoming"),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      decision_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tender_number: {
        type: DataTypes.STRING,
        allowNull: true,
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
    },
    {
      sequelize,
      modelName: "Publication",
      tableName: "Publications",
      timestamps: false,
      underscored: true,
    },
  );

  return Publication;
};
