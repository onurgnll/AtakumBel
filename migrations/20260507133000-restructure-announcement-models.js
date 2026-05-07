"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Council_Decisions", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Karar",
    });
    await queryInterface.addColumn("Council_Decisions", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Council_Decisions", "publish_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Council_Decisions", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("Council_Decisions", "files", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.changeColumn("Council_Decisions", "decision_no", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("Council_Decisions", "summary", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Council_Decisions", "full_text", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Council_Decisions", "date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.changeColumn("Council_Decisions", "council_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("Public_Notices", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Public_Notices", "publish_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Public_Notices", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("Public_Notices", "files", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.changeColumn("Public_Notices", "content", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("Public_Notices", "status", {
      type: Sequelize.ENUM("on_hold", "completed", "upcoming"),
      allowNull: true,
    });

    await queryInterface.addColumn("Tenders", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Ihale Ilani",
    });
    await queryInterface.addColumn("Tenders", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Tenders", "publish_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("Tenders", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("Tenders", "files", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.changeColumn("Tenders", "start_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.changeColumn("Tenders", "end_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.changeColumn("Tenders", "tender_number", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tenders", "files");
    await queryInterface.removeColumn("Tenders", "is_active");
    await queryInterface.removeColumn("Tenders", "publish_date");
    await queryInterface.removeColumn("Tenders", "description");
    await queryInterface.removeColumn("Tenders", "title");

    await queryInterface.removeColumn("Public_Notices", "files");
    await queryInterface.removeColumn("Public_Notices", "is_active");
    await queryInterface.removeColumn("Public_Notices", "publish_date");
    await queryInterface.removeColumn("Public_Notices", "description");

    await queryInterface.removeColumn("Council_Decisions", "files");
    await queryInterface.removeColumn("Council_Decisions", "is_active");
    await queryInterface.removeColumn("Council_Decisions", "publish_date");
    await queryInterface.removeColumn("Council_Decisions", "description");
    await queryInterface.removeColumn("Council_Decisions", "title");
  },
};

