"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Admins");

    if (!table.role) {
      await queryInterface.addColumn("Admins", "role", {
        type: Sequelize.ENUM("superadmin", "admin"),
        allowNull: false,
        defaultValue: "admin",
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE "Admins"
      SET role = 'superadmin'
      WHERE email = 'admin@atakumbel.gov.tr'
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Admins", "role");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Admins_role";');
  },
};
