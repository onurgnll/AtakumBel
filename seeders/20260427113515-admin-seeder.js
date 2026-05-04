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
        username: "admin",
        password: hashedPassword,
        email: "admin@atakumbel.gov.tr",
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
    return queryInterface.bulkDelete("Admins", { username: "admin" }, {});
  },
};
