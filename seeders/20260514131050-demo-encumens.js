"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("Encumens", [
      {
        term_name: C.ENCUMEN_TERM_NAME,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Encumens", { term_name: C.ENCUMEN_TERM_NAME });
  },
};
