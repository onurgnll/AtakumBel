"use strict";

const { Sequelize } = require("sequelize");

const NAMES = ["Sahil Toplanma Alani", "Kent Meydani Toplanma Alani"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("GatheringAreas", [
      {
        name: NAMES[0],
        latitude: 41.3201,
        longitude: 36.2865,
      },
      {
        name: NAMES[1],
        latitude: 41.3218,
        longitude: 36.2902,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("GatheringAreas", { name: { [Sequelize.Op.in]: NAMES } });
  },
};
