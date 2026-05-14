"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { departmentIdByName } = require("./lib/seedHelpers");

module.exports = {
  async up(queryInterface) {
    const fenId = await departmentIdByName(queryInterface, C.DEPT_NAME_FEN);
    const kulturId = await departmentIdByName(queryInterface, C.DEPT_NAME_KULTUR);
    await queryInterface.bulkInsert("Vice_Presidents", [
      {
        first_name: C.VP_SELIM_FIRST,
        last_name: C.VP_SELIM_LAST,
        biography:
          "Altyapi ve ustyapi projelerinde belediye birimleri arasinda koordinasyon gorevini yurutur.",
        image_url: "/uploads/vice-presidents/selim-demir.jpg",
        department_id: fenId,
      },
      {
        first_name: C.VP_AYLIN_FIRST,
        last_name: C.VP_AYLIN_LAST,
        biography:
          "Sosyal hizmetler, kultur-sanat etkinlikleri ve vatandas odakli projelerden sorumludur.",
        image_url: "/uploads/vice-presidents/aylin-cetin.jpg",
        department_id: kulturId,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Vice_Presidents", {
      [Sequelize.Op.or]: [
        { first_name: C.VP_SELIM_FIRST, last_name: C.VP_SELIM_LAST },
        { first_name: C.VP_AYLIN_FIRST, last_name: C.VP_AYLIN_LAST },
      ],
    });
  },
};
