"use strict";

const { Sequelize } = require("sequelize");
const { ATAKUM_GATHERING_AREAS } = require("./data/atakumGatheringAreas");

/** Atakum ilçesi AFAD acil durum toplanma alanları (KEOS geoafad). */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("GatheringAreas", ATAKUM_GATHERING_AREAS);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("GatheringAreas", {
      name: { [Sequelize.Op.in]: ATAKUM_GATHERING_AREAS.map((a) => a.name) },
    });
  },
};
