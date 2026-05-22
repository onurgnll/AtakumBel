"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Department_Documents", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Departments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      publish_date: { type: Sequelize.DATEONLY, allowNull: true },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      files: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
    });

    await queryInterface.addIndex("Department_Documents", ["department_id"], {
      name: "department_documents_department_id_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Department_Documents");
  },
};
