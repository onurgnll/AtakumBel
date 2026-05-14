"use strict";

const { Sequelize } = require("sequelize");

const NAMES = ["Sifir Atik Getirme Merkezi", "Cam Atik Kumbarasi - Sahil"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("WastePoints", [
      {
        name: NAMES[0],
        latitude: 41.3234,
        longitude: 36.2921,
      },
      {
        name: NAMES[1],
        latitude: 41.3189,
        longitude: 36.2848,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("WastePoints", { name: { [Sequelize.Op.in]: NAMES } });
  },
};
