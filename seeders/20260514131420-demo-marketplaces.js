"use strict";

const { Sequelize } = require("sequelize");

const NAMES = ["Cumartesi Pazari", "Carsamba Pazari"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Marketplaces", [
      {
        name: NAMES[0],
        latitude: 41.3245,
        longitude: 36.2933,
        day_of_week: "Saturday",
      },
      {
        name: NAMES[1],
        latitude: 41.3178,
        longitude: 36.2819,
        day_of_week: "Wednesday",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Marketplaces", { name: { [Sequelize.Op.in]: NAMES } });
  },
};
