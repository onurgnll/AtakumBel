"use strict";

const { Sequelize } = require("sequelize");
const { ATAKUM_FREE_WIFI_POINTS } = require("./data/atakumFreeWifiPoints");

/** Atakum ilçesi ücretsiz WiFi noktaları (wifi.atakum.bel.tr). */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("FreeWifiPoints", ATAKUM_FREE_WIFI_POINTS);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("FreeWifiPoints", {
      name: { [Sequelize.Op.in]: ATAKUM_FREE_WIFI_POINTS.map((p) => p.name) },
    });
  },
};
