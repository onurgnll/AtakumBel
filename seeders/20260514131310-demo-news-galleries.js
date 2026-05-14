"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { newsIdByTitle } = require("./lib/seedHelpers");

const IMAGE_URLS = ["/uploads/news-gallery/sahil-1.jpg", "/uploads/news-gallery/spor-okullari-1.jpg"];

module.exports = {
  async up(queryInterface) {
    const n1 = await newsIdByTitle(queryInterface, C.NEWS_TITLE_SAHIL);
    const n2 = await newsIdByTitle(queryInterface, C.NEWS_TITLE_SPOR);
    await queryInterface.bulkInsert("News_Galleries", [
      {
        news_id: n1,
        image_url: IMAGE_URLS[0],
        order: 1,
        is_main: true,
      },
      {
        news_id: n2,
        image_url: IMAGE_URLS[1],
        order: 1,
        is_main: true,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("News_Galleries", {
      image_url: { [Sequelize.Op.in]: IMAGE_URLS },
    });
  },
};
