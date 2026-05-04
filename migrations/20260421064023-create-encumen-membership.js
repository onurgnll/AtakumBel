"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Encumen_Memberships", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      encumen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Encumens",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      member_type: {
        type: Sequelize.ENUM("staff", "council_member"),
        allowNull: false,
      },
      member_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Encumen_Memberships");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Encumen_Memberships_member_type";',
    );
  },
};
