"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContactInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContactInfo.init(
    {
      placeholder: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ContactInfo",
    },
  );
  return ContactInfo;
};
module.exports = (sequelize, DataTypes) => {
  class ContactInfo extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }

  ContactInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kep_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      working_hours: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ContactInfo",
      tableName: "Contact_Infos",
      timestamps: false,
      underscored: true,
    },
  );

  return ContactInfo;
};
