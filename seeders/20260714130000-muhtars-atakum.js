"use strict";

const { Sequelize } = require("sequelize");
const { ATAKUM_MUHTARS } = require("./data/atakumMuhtars");

/** Atakum ilçesi mahalle muhtarlıkları başlangıç verisi. */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Muhtars", ATAKUM_MUHTARS);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Muhtars", {
      mahalle_name: { [Sequelize.Op.in]: ATAKUM_MUHTARS.map((m) => m.mahalle_name) },
    });
  },
};
