"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Suggestions", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      project_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      project_purpose: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      application_duration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_budget: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      stakeholders: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      beneficiaries: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      main_activities: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expected_results: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "reviewed", "completed"),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Suggestions");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Suggestions_status";',
    );
  },
};
