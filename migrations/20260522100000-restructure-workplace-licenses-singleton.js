"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Workplace_Licenses", "content", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.removeColumn("Workplace_Licenses", "title");
    await queryInterface.removeColumn("Workplace_Licenses", "description");
    await queryInterface.removeColumn("Workplace_Licenses", "publish_date");
    await queryInterface.removeColumn("Workplace_Licenses", "is_active");

    await queryInterface.sequelize.query(
      `DELETE FROM "Workplace_Licenses" WHERE id NOT IN (
        SELECT MIN(id) FROM "Workplace_Licenses"
      )`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Workplace_Licenses", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Belge",
    });
    await queryInterface.addColumn("Workplace_Licenses", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Workplace_Licenses", "publish_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Workplace_Licenses", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.removeColumn("Workplace_Licenses", "content");
  },
};
