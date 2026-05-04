"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("President_Galleries", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      president_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Presidents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_main: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("President_Galleries");
  },
};
