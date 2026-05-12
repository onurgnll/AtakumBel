"use strict";

/** Müdürlük ya başkana (reports_to_president=true) ya da bir başkan yardımcısına (Vice_President_Departments) bağlı olabilir. */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Departments", "reports_to_president", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Departments", "reports_to_president");
  },
};
