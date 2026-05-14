"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { departmentIdByName } = require("./lib/seedHelpers");
const IMG = require("./data/demoSeedImageUrls");

const TENDER_NUMBERS = ["ATK-2026-001", "ATK-2026-002"];

module.exports = {
  async up(queryInterface) {
    const fenId = await departmentIdByName(queryInterface, C.DEPT_NAME_FEN);
    const sosyalId = await departmentIdByName(queryInterface, C.DEPT_NAME_SOSYAL);

    await queryInterface.bulkInsert("Tenders", [
      {
        title: "İhale İlanı — Sahil Düzenleme",
        description: "Sahil düzenleme ihale ilanı.",
        publish_date: "2026-05-20",
        is_active: true,
        files: JSON.stringify([IMG.HERO_5, "/uploads/tenders/ihale-sahil.pdf"]),
        department_id: fenId,
        start_date: "2026-05-20",
        end_date: "2026-06-05",
        tender_number: TENDER_NUMBERS[0],
      },
      {
        title: "İhale İlanı — Sosyal Destek Hizmeti",
        description: "Sosyal destek hizmeti ihale duyurusu.",
        publish_date: "2026-06-01",
        is_active: true,
        files: JSON.stringify([IMG.HERO_1, "/uploads/tenders/ihale-sosyal.pdf"]),
        department_id: sosyalId,
        start_date: "2026-06-01",
        end_date: "2026-06-15",
        tender_number: TENDER_NUMBERS[1],
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Tenders", {
      tender_number: { [Sequelize.Op.in]: TENDER_NUMBERS },
    });
  },
};
