"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { departmentIdByName } = require("./lib/seedHelpers");

module.exports = {
  async up(queryInterface) {
    const fenId = await departmentIdByName(queryInterface, C.DEPT_NAME_FEN);
    await queryInterface.bulkInsert("Vice_Presidents", [
      {
        first_name: C.VP_1_FIRST,
        last_name: C.VP_1_LAST,
        biography:
          "Altyapi ve ustyapi projelerinde belediye birimleri arasinda koordinasyon gorevini yurutur.",
        image_url: "/uploads/vice-presidents/1.jpg",
        department_id: fenId,
      },
      {
        first_name: C.VP_2_FIRST,
        last_name: C.VP_2_LAST,
        biography:
          "Sosyal hizmetler, kultur-sanat etkinlikleri ve vatandas odakli projelerden sorumludur.",
        image_url: "/uploads/vice-presidents/2.jpg",
        department_id: fenId,
      },
      {
        first_name: C.VP_3_FIRST,
        last_name: C.VP_3_LAST,
        biography:
          "Sosyal hizmetler, kultur-sanat etkinlikleri ve vatandas odakli projelerden sorumludur.",
        image_url: "/uploads/vice-presidents/3.jpg",
        department_id: fenId,
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Vice_Presidents", {
      [Sequelize.Op.or]: [
        { first_name: C.VP_1_FIRST, last_name: C.VP_1_LAST },
        { first_name: C.VP_2_FIRST, last_name: C.VP_2_LAST },
        { first_name: C.VP_3_FIRST, last_name: C.VP_3_LAST },
      ],
    });
  },
};
