"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Presidents", "birth_place", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Presidents", "birth_year", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Presidents", "grown_place", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Presidents", "marital_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Presidents", "education", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.addColumn("Presidents", "political_career", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.addColumn("Presidents", "work_life", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Presidents", "work_life");
    await queryInterface.removeColumn("Presidents", "political_career");
    await queryInterface.removeColumn("Presidents", "education");
    await queryInterface.removeColumn("Presidents", "marital_status");
    await queryInterface.removeColumn("Presidents", "grown_place");
    await queryInterface.removeColumn("Presidents", "birth_year");
    await queryInterface.removeColumn("Presidents", "birth_place");
  },
};
