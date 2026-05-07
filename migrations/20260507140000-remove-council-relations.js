"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const councilMembersTable = await queryInterface.describeTable("Council_Members");
    if (councilMembersTable.council_id) {
      await queryInterface.removeColumn("Council_Members", "council_id");
    }

    const councilDecisionsTable = await queryInterface.describeTable("Council_Decisions");
    if (councilDecisionsTable.council_id) {
      await queryInterface.removeColumn("Council_Decisions", "council_id");
    }
  },

  async down(queryInterface, Sequelize) {
    const councilMembersTable = await queryInterface.describeTable("Council_Members");
    if (!councilMembersTable.council_id) {
      await queryInterface.addColumn("Council_Members", "council_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    const councilDecisionsTable = await queryInterface.describeTable("Council_Decisions");
    if (!councilDecisionsTable.council_id) {
      await queryInterface.addColumn("Council_Decisions", "council_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};

