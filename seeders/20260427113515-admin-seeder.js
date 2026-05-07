"use strict";
const bcrypt = require("bcryptjs");
require("dotenv").config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const plainPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    return queryInterface.bulkInsert("Admins", [
      {
        first_name: "Sistem",
        last_name: "Yonetici",
        password: hashedPassword,
        email: "admin@atakumbel.gov.tr",
        phone_number: "05452049126",
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
        last_login: new Date(),
        permissions: JSON.stringify({
          all: true,
        }),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Admins", { email: "admin@atakumbel.gov.tr" }, {});
  },
};
