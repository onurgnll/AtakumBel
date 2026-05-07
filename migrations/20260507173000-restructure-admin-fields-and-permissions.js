"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Admins");

    if (!table.first_name) {
      await queryInterface.addColumn("Admins", "first_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.last_name) {
      await queryInterface.addColumn("Admins", "last_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!table.phone_number) {
      await queryInterface.addColumn("Admins", "phone_number", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (table.username) {
      await queryInterface.sequelize.query(`
        UPDATE "Admins"
        SET first_name = COALESCE(first_name, username),
            last_name = COALESCE(last_name, 'Belirtilmedi')
      `);
      await queryInterface.removeColumn("Admins", "username");
    }

    await queryInterface.sequelize.query(`
      UPDATE "Admins"
      SET first_name = COALESCE(first_name, 'Admin'),
          last_name = COALESCE(last_name, 'User'),
          phone_number = COALESCE(phone_number, '-')
    `);

    await queryInterface.changeColumn("Admins", "first_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Admins", "last_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Admins", "phone_number", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Admins", "last_login", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn("Admins", "permissions", {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {},
    });
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Admins");

    if (!table.username) {
      await queryInterface.addColumn("Admins", "username", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    await queryInterface.sequelize.query(`
      UPDATE "Admins"
      SET username = COALESCE(username, first_name)
    `);

    await queryInterface.changeColumn("Admins", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("Admins", "last_login", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.changeColumn("Admins", "permissions", {
      type: Sequelize.JSON,
      allowNull: false,
    });

    if (table.first_name) {
      await queryInterface.removeColumn("Admins", "first_name");
    }
    if (table.last_name) {
      await queryInterface.removeColumn("Admins", "last_name");
    }
    if (table.phone_number) {
      await queryInterface.removeColumn("Admins", "phone_number");
    }
  },
};
