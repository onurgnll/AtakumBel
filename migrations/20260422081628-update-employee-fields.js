"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. image_url alanını boş bırakılabilir (allowNull: true) yapıyoruz
    await queryInterface.changeColumn("Employees", "image_url", {
      type: Sequelize.STRING,
      allowNull: true, // Boş bırakılabilir
    });

    // 2. is_unit_manager alanına varsayılan değer (defaultValue: false) ekliyoruz
    await queryInterface.changeColumn("Employees", "is_unit_manager", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Varsayılan olarak müdür değil
    });
  },

  async down(queryInterface, Sequelize) {
    // Geri alma (Undo) durumunda yapılacak işlemler
    await queryInterface.changeColumn("Employees", "image_url", {
      type: Sequelize.STRING,
      allowNull: false, // Eski haline getir
    });

    await queryInterface.changeColumn("Employees", "is_unit_manager", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },
};
