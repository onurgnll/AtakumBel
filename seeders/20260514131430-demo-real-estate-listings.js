"use strict";

const { Sequelize } = require("sequelize");

const TITLES = ["Satilik Belediye Arsasi", "Kiralik Belediye Is Yeri"];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Real_Estate_Listings", [
      {
        title: TITLES[0],
        description: "Atakum ilcesinde satilik arsa ilanidir.",
        publish_date: "2026-06-12",
        is_active: true,
        files: JSON.stringify(["/uploads/real-estate/arsa-1001.pdf"]),
      },
      {
        title: TITLES[1],
        description: "Merkezi konumda kiralik is yeri ilanidir.",
        publish_date: "2026-06-15",
        is_active: true,
        files: JSON.stringify(["/uploads/real-estate/isyeri-1002.pdf"]),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Real_Estate_Listings", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
