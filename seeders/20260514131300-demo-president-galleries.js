"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { presidentIdByName } = require("./lib/seedHelpers");

const IMAGE_URLS = ["/uploads/president-gallery/baskan-1.jpg", "/uploads/president-gallery/baskan-2.jpg"];

module.exports = {
  async up(queryInterface) {
    const presidentId = await presidentIdByName(
      queryInterface,
      C.PRESIDENT_FIRST,
      C.PRESIDENT_LAST,
    );
    await queryInterface.bulkInsert("President_Galleries", [
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[0],
        order: 1,
        is_main: true,
      },
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[1],
        order: 2,
        is_main: false,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("President_Galleries", {
      image_url: { [Sequelize.Op.in]: IMAGE_URLS },
    });
  },
};
