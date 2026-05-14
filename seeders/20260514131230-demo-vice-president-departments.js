"use strict";

const C = require("./data/demoSeedConstants");
const { departmentIdByName, vicePresidentIdByName } = require("./lib/seedHelpers");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const fenId = await departmentIdByName(queryInterface, C.DEPT_NAME_FEN);
    const temizlikId = await departmentIdByName(queryInterface, C.DEPT_NAME_TEMIZLIK);
    const kulturId = await departmentIdByName(queryInterface, C.DEPT_NAME_KULTUR);
    const vpSelim = await vicePresidentIdByName(
      queryInterface,
      C.VP_SELIM_FIRST,
      C.VP_SELIM_LAST,
    );
    const vpAylin = await vicePresidentIdByName(
      queryInterface,
      C.VP_AYLIN_FIRST,
      C.VP_AYLIN_LAST,
    );
    await queryInterface.bulkInsert("Vice_President_Departments", [
      {
        vice_president_id: vpSelim,
        department_id: fenId,
        created_at: now,
        updated_at: now,
      },
      {
        vice_president_id: vpSelim,
        department_id: temizlikId,
        created_at: now,
        updated_at: now,
      },
      {
        vice_president_id: vpAylin,
        department_id: kulturId,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM "Vice_President_Departments" WHERE vice_president_id IN (
        SELECT id FROM "Vice_Presidents" WHERE
          (first_name = :sf AND last_name = :sl) OR (first_name = :af AND last_name = :al)
      )`,
      {
        replacements: {
          sf: C.VP_SELIM_FIRST,
          sl: C.VP_SELIM_LAST,
          af: C.VP_AYLIN_FIRST,
          al: C.VP_AYLIN_LAST,
        },
      },
    );
  },
};
