"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("Presidents", "social_media_accounts", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn("Council_Decisions", "file_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Public_Notices", "start_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Public_Notices", "end_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn("Tenders", "department_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Departments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.removeColumn("Tenders", "notice_id");

    await queryInterface.renameColumn("Employees", "extension_no", "dahili_no");
    await queryInterface.addColumn("Employees", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("Employees", "is_contact_person", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("Departments", "manager_employee_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Employees",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.changeColumn("Vice_Presidents", "department_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Departments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.createTable("Vice_President_Departments", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      vice_president_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Vice_Presidents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint(
      "Vice_President_Departments",
      {
        fields: ["vice_president_id", "department_id"],
        type: "unique",
        name: "vice_president_departments_unique_relation",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Vice_President_Departments",
      "vice_president_departments_unique_relation",
    );
    await queryInterface.dropTable("Vice_President_Departments");

    await queryInterface.changeColumn("Vice_Presidents", "department_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Departments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("Departments", "manager_employee_id");

    await queryInterface.removeColumn("Employees", "is_contact_person");
    await queryInterface.removeColumn("Employees", "is_active");
    await queryInterface.renameColumn("Employees", "dahili_no", "extension_no");

    await queryInterface.addColumn("Tenders", "notice_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Public_Notices",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.removeColumn("Tenders", "department_id");

    await queryInterface.removeColumn("Public_Notices", "end_date");
    await queryInterface.removeColumn("Public_Notices", "start_date");

    await queryInterface.removeColumn("Council_Decisions", "file_url");
    await queryInterface.removeColumn("Presidents", "social_media_accounts");

    await queryInterface.removeColumn("Bank_Accounts", "fax");
    await queryInterface.removeColumn("Bank_Accounts", "phone");
    await queryInterface.removeColumn("Bank_Accounts", "recipient_name");
  },
};
