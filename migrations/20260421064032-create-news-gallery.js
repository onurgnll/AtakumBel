"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("News_Galleries", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "News",
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
    await queryInterface.dropTable("News_Galleries");
  },
};
