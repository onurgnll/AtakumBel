"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { presidentIdByName } = require("./lib/seedHelpers");

const IMAGE_URLS = ["/uploads/president-galleries/1.jpg", "/uploads/president-galleries/2.jpg", "/uploads/president-galleries/3.jpg", "/uploads/president-galleries/4.jpg", "/uploads/president-galleries/5.jpg", "/uploads/president-galleries/6.jpg", "/uploads/president-galleries/7.jpg", "/uploads/president-galleries/8.jpg",];

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
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[2],
        order: 3,
        is_main: false,
      },
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[3],
        order: 4,
        is_main: false,
      },
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[4],
        order: 5,
        is_main: false,
      },
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[5],
        order: 6,
        is_main: false,
      },
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[6],
        order: 7,
        is_main: false,
      },
      {
        president_id: presidentId,
        image_url: IMAGE_URLS[7],
        order: 8,
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
