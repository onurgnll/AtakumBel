"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Events", [
      {
        title: C.EVENT_TITLE_SENLIK,
        type: "activity",
        start_date: "2026-06-10",
        end_date: "2026-06-10",
        event_time: "14:00:00",
        address: "Atakum Kent Meydani",
        description:
          "Atolye, sahne gosteri ve oyun alanlariyla tum cocuklara acik belediye etkinligi.",
      },
      {
        title: C.EVENT_TITLE_KOSU,
        type: "competition",
        start_date: "2026-07-05",
        end_date: "2026-07-05",
        event_time: "09:00:00",
        address: "Atakum Sahil Yolu Baslangic Noktasi",
        description:
          "Amator ve profesyonel sporculara acik 10K sahil kosusu organizasyonu.",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Events", {
      title: { [Sequelize.Op.in]: [C.EVENT_TITLE_SENLIK, C.EVENT_TITLE_KOSU] },
    });
  },
};
