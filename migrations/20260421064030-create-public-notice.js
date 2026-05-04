"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Public_Notices", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("on_hold", "completed", "upcoming"),
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      decision_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Council_Decisions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Public_Notices");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Public_Notices_status";',
    );
  },
};
