"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Keep the earliest relation for each department, remove duplicates.
    await queryInterface.sequelize.query(`
      DELETE FROM "Vice_President_Departments" vpd
      USING (
        SELECT id
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY id ASC) AS rn
          FROM "Vice_President_Departments"
        ) ranked
        WHERE ranked.rn > 1
      ) dupes
      WHERE vpd.id = dupes.id;
    `);

    await queryInterface.addConstraint("Vice_President_Departments", {
      fields: ["department_id"],
      type: "unique",
      name: "unique_department_per_vice_president",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "Vice_President_Departments",
      "unique_department_per_vice_president",
    );
  },
};
