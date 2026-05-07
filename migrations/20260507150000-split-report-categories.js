"use strict";

const categoryColumns = (Sequelize) => ({
  id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, allowNull: true },
  publish_date: { type: Sequelize.DATEONLY, allowNull: true },
  is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  files: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Activity_Reports", categoryColumns(Sequelize));
    await queryInterface.createTable(
      "Financial_Expectation_Reports",
      categoryColumns(Sequelize),
    );
    await queryInterface.createTable("Performance_Programs", categoryColumns(Sequelize));
    await queryInterface.createTable("Audit_Reports", categoryColumns(Sequelize));
    await queryInterface.createTable("Strategic_Plans", categoryColumns(Sequelize));
    await queryInterface.createTable("Kvkk_Documents", categoryColumns(Sequelize));

    await queryInterface.addColumn("Press_Materials", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Basin Materyali",
    });
    await queryInterface.addColumn("Press_Materials", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Press_Materials", "publish_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Press_Materials", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("Press_Materials", "files", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.changeColumn("Press_Materials", "file_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Press_Materials", "file_url", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn("Press_Materials", "files");
    await queryInterface.removeColumn("Press_Materials", "is_active");
    await queryInterface.removeColumn("Press_Materials", "publish_date");
    await queryInterface.removeColumn("Press_Materials", "description");
    await queryInterface.removeColumn("Press_Materials", "title");

    await queryInterface.dropTable("Kvkk_Documents");
    await queryInterface.dropTable("Strategic_Plans");
    await queryInterface.dropTable("Audit_Reports");
    await queryInterface.dropTable("Performance_Programs");
    await queryInterface.dropTable("Financial_Expectation_Reports");
    await queryInterface.dropTable("Activity_Reports");
  },
};

