"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { departmentIdByName, councilDecisionIdByNo } = require("./lib/seedHelpers");
const IMG = require("./data/demoSeedImageUrls");

const TITLES = [
  "Sahil Düzenleme Yapım İşi İhale İlanı",
  "Sosyal Destek Başvuru Takvimi",
];

module.exports = {
  async up(queryInterface) {
    const fenId = await departmentIdByName(queryInterface, C.DEPT_NAME_FEN);
    const sosyalId = await departmentIdByName(queryInterface, C.DEPT_NAME_SOSYAL);
    const decSahil = await councilDecisionIdByNo(queryInterface, C.COUNCIL_DECISION_NO_SAHIL);
    const decSosyal = await councilDecisionIdByNo(queryInterface, C.COUNCIL_DECISION_NO_SOSYAL);

    await queryInterface.bulkInsert("Public_Notices", [
      {
        title: TITLES[0],
        description: "Sahil düzenleme yapım işi duyuru açıklaması.",
        publish_date: "2026-05-01",
        is_active: true,
        files: JSON.stringify(["/uploads/notices/sahil-duzenleme-ihale.pdf", IMG.HERO_3]),
        content:
          "Sahil düzenleme etap-1 yapım işi için açık ihale usulü ile teklif alınacaktır.",
        status: "upcoming",
        start_date: "2026-05-01",
        end_date: "2026-06-05",
        file_url: IMG.HERO_3,
        department_id: fenId,
        decision_id: decSahil,
      },
      {
        title: TITLES[1],
        description: "Sosyal destek programı başvuru duyurusu.",
        publish_date: "2026-06-01",
        is_active: true,
        files: JSON.stringify(["/uploads/notices/sosyal-destek-takvim.pdf", IMG.HERO_4]),
        content:
          "2026 yılı sosyal destek programı başvuru takvimi ve gerekli belgeler ilan edilmiştir.",
        status: "on_hold",
        start_date: "2026-06-01",
        end_date: "2026-06-30",
        file_url: IMG.HERO_4,
        department_id: sosyalId,
        decision_id: decSosyal,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Public_Notices", { title: { [Sequelize.Op.in]: TITLES } });
  },
};
