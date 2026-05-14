"use strict";

/**
 * Vice_Presidents.department_id — çoklu müdürlük ilişkisi Vice_President_Departments
 * üzerinden tutulur; bu sütun legacy alan olarak NULL olabilmeli.
 * Eski şemada NOT NULL kalan veritabanları için idempotent düzeltme.
 */
module.exports = {
  async up(queryInterface) {
    // changeColumn FK ile bazı PG kurulumlarında sorun çıkarabiliyor; doğrudan DDL güvenilir.
    await queryInterface.sequelize.query(
      'ALTER TABLE "Vice_Presidents" ALTER COLUMN "department_id" DROP NOT NULL;',
    );
  },

  async down(queryInterface, Sequelize) {
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
  },
};
