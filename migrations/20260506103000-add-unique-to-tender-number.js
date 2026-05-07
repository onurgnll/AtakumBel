"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Tenders");
    if (!table.tender_number) {
      return;
    }

    try {
      await queryInterface.addConstraint("Tenders", {
        fields: ["tender_number"],
        type: "unique",
        name: "tenders_tender_number_unique",
      });
    } catch (error) {
      // Constraint zaten mevcutsa migration'ı idempotent tut.
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint(
        "Tenders",
        "tenders_tender_number_unique",
      );
    } catch (error) {
      // Constraint yoksa geri alma adımını geç.
    }
  },
};
