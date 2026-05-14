"use strict";

const { Sequelize } = require("sequelize");
const { MECLIS_UYELERI } = require("./data/meclisUyeleriAtakum");

module.exports = {
  async up(queryInterface) {
    const rows = MECLIS_UYELERI.map((m, i) => ({
      first_name: m.first_name,
      last_name: m.last_name,
      political_party: m.political_party,
      image_url: `/uploads/council-members/atakum-meclis-${String(i + 1).padStart(3, "0")}.jpg`,
    }));
    await queryInterface.bulkInsert("Council_Members", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Council_Members", {
      image_url: { [Sequelize.Op.like]: "/uploads/council-members/atakum-meclis-%" },
    });
  },
};
