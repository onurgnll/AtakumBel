"use strict";

const { Sequelize } = require("sequelize");
const birim = require("./data/atakumBirimSeed");

/** https://atakum.bel.tr birim detayları — müdürlükler + site personeli (otomatik id). */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Departments", birim.departmentsForInsert);
    const placeholders = birim.seededDepartmentNames.map((_, i) => `:d${i}`).join(", ");
    const replacements = Object.fromEntries(
      birim.seededDepartmentNames.map((n, i) => [`d${i}`, n]),
    );
    const [deptRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Departments" WHERE name IN (${placeholders})`,
      { replacements },
    );
    const nameToId = Object.fromEntries(deptRows.map((r) => [r.name, r.id]));
    const employees = birim.websiteEmployeesSource.map(({ id, department_id: oldDeptId, ...rest }) => {
      const deptName = birim.departmentNameByOldId[oldDeptId];
      const newDeptId = deptName ? nameToId[deptName] : null;
      if (newDeptId == null) {
        throw new Error(`Çalışan için müdürlük eşlenemedi (eski department_id=${oldDeptId}).`);
      }
      return { ...rest, department_id: newDeptId };
    });
    await queryInterface.bulkInsert("Employees", employees);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Employees", {
      image_url: { [Sequelize.Op.like]: "/uploads/employees/birim-%" },
    });
    await queryInterface.bulkDelete("Departments", {
      name: { [Sequelize.Op.in]: birim.seededDepartmentNames },
    });
  },
};
