"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { eventIdByTitle } = require("./lib/seedHelpers");

const IMAGE_URLS = ["/uploads/event-gallery/cocuk-senligi-1.jpg", "/uploads/event-gallery/sahil-kosusu-1.jpg"];

module.exports = {
  async up(queryInterface) {
    const e1 = await eventIdByTitle(queryInterface, C.EVENT_TITLE_SENLIK);
    const e2 = await eventIdByTitle(queryInterface, C.EVENT_TITLE_KOSU);
    await queryInterface.bulkInsert("Event_Galleries", [
      {
        event_id: e1,
        image_url: IMAGE_URLS[0],
        order: 1,
        is_main: true,
      },
      {
        event_id: e2,
        image_url: IMAGE_URLS[1],
        order: 1,
        is_main: true,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Event_Galleries", {
      image_url: { [Sequelize.Op.in]: IMAGE_URLS },
    });
  },
};
