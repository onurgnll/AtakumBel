"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { departmentIdByName, councilDecisionIdByNo } = require("./lib/seedHelpers");

const TITLES = [
  "Sahil Duzenleme Yapim Isi Ihale Ilani",
  "Sosyal Destek Basvuru Takvimi",
];

module.exports = {
  async up(queryInterface) {
    const fenId = await departmentIdByName(queryInterface, C.DEPT_NAME_FEN);
    const sosyalId = await departmentIdByName(queryInterface, C.DEPT_NAME_SOSYAL);
    const dec1 = await councilDecisionIdByNo(queryInterface, C.COUNCIL_DECISION_NO_SAHIL);
    const dec2 = await councilDecisionIdByNo(queryInterface, C.COUNCIL_DECISION_NO_SOSYAL);
    await queryInterface.bulkInsert("Public_Notices", [
      {
        title: TITLES[0],
        description: "Sahil duzenleme yapim isi duyuru aciklamasi.",
        publish_date: "2026-05-01",
        is_active: true,
        files: JSON.stringify(["/uploads/notices/sahil-duzenleme-ihale.pdf"]),
        content:
          "Sahil duzenleme etap-1 yapim isi icin acik ihale usulu ile teklif alinacaktir.",
        status: "upcoming",
        start_date: "2026-05-01",
        end_date: "2026-06-05",
        file_url: "/uploads/notices/sahil-duzenleme-ihale.pdf",
        department_id: fenId,
        decision_id: dec1,
      },
      {
        title: TITLES[1],
        description: "Sosyal destek programi basvuru duyurusu.",
        publish_date: "2026-06-01",
        is_active: true,
        files: JSON.stringify(["/uploads/notices/sosyal-destek-takvim.pdf"]),
        content:
          "2026 yili sosyal destek programi basvuru takvimi ve gerekli belgeler ilan edilmistir.",
        status: "on_hold",
        start_date: "2026-06-01",
        end_date: "2026-06-30",
        file_url: "/uploads/notices/sosyal-destek-takvim.pdf",
        department_id: sosyalId,
        decision_id: dec2,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Public_Notices", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
