"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const IMG = require("./data/demoSeedImageUrls");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Council_Decisions", [
      {
        title: "Meclis Kararı — Sahil Düzenleme",
        description: "Sahil düzenleme projesi 1. etap karar açıklaması.",
        publish_date: "2026-04-12",
        is_active: true,
        files: JSON.stringify(["/uploads/council-decisions/karar-sahil.pdf", IMG.HERO_1]),
        decision_no: C.COUNCIL_DECISION_NO_SAHIL,
        summary: "Atakum Sahil Düzenleme Projesi 1. Etap Onayı",
        full_text:
          "Proje kapsamında yaya yolu, bisiklet yolu ve peyzaj düzenlemelerinin ihale sürecine çıkılmasına karar verildi.",
        date: "2026-04-12",
        file_url: IMG.HERO_1,
      },
      {
        title: "Meclis Kararı — Sosyal Destek",
        description: "Sosyal destek bütçe revizyon kararı.",
        publish_date: "2026-04-30",
        is_active: true,
        files: JSON.stringify(["/uploads/council-decisions/karar-sosyal.pdf", IMG.HERO_2]),
        decision_no: C.COUNCIL_DECISION_NO_SOSYAL,
        summary: "Sosyal Destek Programı Bütçe Revizyonu",
        full_text:
          "İhtiyaç sahibi ailelere yönelik destek kalemlerinin genişletilmesine ve ek bütçe ayrılmasına karar verildi.",
        date: "2026-04-30",
        file_url: IMG.HERO_2,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Council_Decisions", {
      decision_no: { [Sequelize.Op.in]: [C.COUNCIL_DECISION_NO_SAHIL, C.COUNCIL_DECISION_NO_SOSYAL] },
    });
  },
};
