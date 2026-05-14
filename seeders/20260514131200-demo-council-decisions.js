"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Council_Decisions", [
      {
        title: "Meclis Karari - Sahil Duzenleme",
        description: "Sahil duzenleme projesi 1. etap karar aciklamasi.",
        publish_date: "2026-04-12",
        is_active: true,
        files: JSON.stringify(["/uploads/council-decisions/karar-1001.pdf"]),
        decision_no: C.COUNCIL_DECISION_NO_SAHIL,
        summary: "Atakum Sahil Duzenleme Projesi 1. Etap Onayi",
        full_text:
          "Proje kapsaminda yaya yolu, bisiklet yolu ve peyzaj duzenlemelerinin ihale surecine cikilmasina karar verildi.",
        date: "2026-04-12",
      },
      {
        title: "Meclis Karari - Sosyal Destek",
        description: "Sosyal destek butce revizyon karari.",
        publish_date: "2026-04-30",
        is_active: true,
        files: JSON.stringify(["/uploads/council-decisions/karar-1002.pdf"]),
        decision_no: C.COUNCIL_DECISION_NO_SOSYAL,
        summary: "Sosyal Destek Programi Butce Revizyonu",
        full_text:
          "Ihtiyac sahibi ailelere yonelik destek kalemlerinin genisletilmesine ve ek butce ayrilmasina karar verildi.",
        date: "2026-04-30",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Council_Decisions", {
      decision_no: { [Sequelize.Op.in]: [C.COUNCIL_DECISION_NO_SAHIL, C.COUNCIL_DECISION_NO_SOSYAL] },
    });
  },
};
