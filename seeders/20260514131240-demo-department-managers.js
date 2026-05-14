"use strict";

/** Birim şube müdürlerinden (is_unit_manager) müdürlük müdürü alanını doldurur. */
module.exports = {
  async up(queryInterface) {
    const dialect = queryInterface.sequelize.getDialect();
    if (dialect === "postgres") {
      await queryInterface.sequelize.query(`
        UPDATE "Departments" AS d
        SET manager_employee_id = sub.first_mgr
        FROM (
          SELECT department_id, MIN(id) AS first_mgr
          FROM "Employees"
          WHERE is_active = true AND is_unit_manager = true
          GROUP BY department_id
        ) AS sub
        WHERE d.id = sub.department_id
          AND d.manager_employee_id IS NULL
      `);
    } else {
      const [depts] = await queryInterface.sequelize.query(
        `SELECT id FROM "Departments" WHERE manager_employee_id IS NULL`,
      );
      for (const row of depts) {
        const [[emp]] = await queryInterface.sequelize.query(
          `SELECT id FROM "Employees" WHERE department_id = ${Number(row.id)} AND is_active = 1 AND is_unit_manager = 1 ORDER BY id ASC LIMIT 1`,
        );
        if (emp && emp.id) {
          await queryInterface.bulkUpdate(
            "Departments",
            { manager_employee_id: emp.id },
            { id: row.id },
          );
        }
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "Departments" SET manager_employee_id = NULL
      WHERE id IN (
        SELECT DISTINCT department_id FROM "Employees"
        WHERE image_url LIKE '/uploads/employees/birim-%'
      )
    `);
  },
};
