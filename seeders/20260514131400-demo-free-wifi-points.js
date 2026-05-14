"use strict";

const { Sequelize } = require("sequelize");

const NAMES = ["Atakum Sahil Ucretsiz WiFi", "Atakum Kent Meydani Ucretsiz WiFi"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("FreeWifiPoints", [
      {
        name: NAMES[0],
        latitude: 41.3195,
        longitude: 36.2859,
      },
      {
        name: NAMES[1],
        latitude: 41.3223,
        longitude: 36.2897,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("FreeWifiPoints", { name: { [Sequelize.Op.in]: NAMES } });
  },
};
