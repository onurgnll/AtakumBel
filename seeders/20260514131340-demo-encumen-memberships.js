"use strict";

const C = require("./data/demoSeedConstants");
const { encumenIdByTermName } = require("./lib/seedHelpers");

module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(
      `SELECT id FROM "Council_Members" WHERE first_name = :fn AND last_name = :ln LIMIT 1`,
      { replacements: { fn: "Ahmet", ln: "ÇAM" } },
    );
    const councilMemberId = rows[0]?.id;
    if (councilMemberId == null) {
      throw new Error(
        'Council_Members satırı bulunamadı (encümen üyeliği için "Ahmet" "ÇAM" gerekli). Önce council members seeder çalışmalı.',
      );
    }
    const [staffRows] = await queryInterface.sequelize.query(
      `SELECT id FROM "Employees" WHERE image_url LIKE :pattern ORDER BY id ASC LIMIT 1`,
      { replacements: { pattern: "/uploads/employees/birim-%" } },
    );
    const staffEmployeeId = staffRows[0]?.id;
    if (staffEmployeeId == null) {
      throw new Error(
        "Employees satırı bulunamadı (encümen personeli için birim personeli gerekli). Önce departments/employees seeder çalışmalı.",
      );
    }
    const encumenId = await encumenIdByTermName(queryInterface, C.ENCUMEN_TERM_NAME);
    await queryInterface.bulkInsert("Encumen_Memberships", [
      {
        encumen_id: encumenId,
        member_type: "staff",
        member_id: staffEmployeeId,
      },
      {
        encumen_id: encumenId,
        member_type: "council_member",
        member_id: councilMemberId,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM "Encumen_Memberships" AS em
       USING "Encumens" AS e
       WHERE em.encumen_id = e.id AND e.term_name = :term`,
      { replacements: { term: C.ENCUMEN_TERM_NAME } },
    );
  },
};
