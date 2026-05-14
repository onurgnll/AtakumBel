"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { eventIdByTitle } = require("./lib/seedHelpers");
const IMG = require("./data/demoSeedImageUrls");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Events", [
      {
        title: C.EVENT_TITLE_SENLIK,
        type: "activity",
        start_date: "2026-06-10",
        end_date: "2026-06-10",
        event_time: "14:00:00",
        address: "Atakum Kent Meydanı",
        description:
          "Atölye, sahne gösteri ve oyun alanlarıyla tüm çocuklara açık belediye etkinliği.",
      },
      {
        title: C.EVENT_TITLE_KOSU,
        type: "competition",
        start_date: "2026-07-05",
        end_date: "2026-07-05",
        event_time: "09:00:00",
        address: "Atakum Sahil Yolu Başlangıç Noktası",
        description: "Amatör ve profesyonel sporculara açık 10K sahil koşusu organizasyonu.",
      },
    ]);

    const eSenlik = await eventIdByTitle(queryInterface, C.EVENT_TITLE_SENLIK);
    const eKosu = await eventIdByTitle(queryInterface, C.EVENT_TITLE_KOSU);
    await queryInterface.bulkInsert("Event_Galleries", [
      { event_id: eSenlik, image_url: IMG.HERO_2, order: 1, is_main: true },
      { event_id: eSenlik, image_url: IMG.HERO_5, order: 2, is_main: false },
      { event_id: eKosu, image_url: IMG.HERO_3, order: 1, is_main: true },
      { event_id: eKosu, image_url: IMG.HERO_1, order: 2, is_main: false },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Events", {
      title: { [Sequelize.Op.in]: [C.EVENT_TITLE_SENLIK, C.EVENT_TITLE_KOSU] },
    });
  },
};
