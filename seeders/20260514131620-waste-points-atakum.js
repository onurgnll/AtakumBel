"use strict";

const { Sequelize } = require("sequelize");
const { ATAKUM_WASTE_POINTS } = require("./data/atakumWastePoints");

/** Atakum ilçesi atık toplama konteyner noktaları (KEOS geocop_konteyner). */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("WastePoints", ATAKUM_WASTE_POINTS);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("WastePoints", {
      name: { [Sequelize.Op.in]: ATAKUM_WASTE_POINTS.map((p) => p.name) },
    });
  },
};
