"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { facilityIdByName } = require("./lib/seedHelpers");

const IMAGE_URLS = ["/uploads/facility-gallery/genclik-merkezi-1.jpg", "/uploads/facility-gallery/kutuphane-1.jpg"];

module.exports = {
  async up(queryInterface) {
    const f1 = await facilityIdByName(queryInterface, C.FACILITY_NAME_GENCLIK);
    const f2 = await facilityIdByName(queryInterface, C.FACILITY_NAME_KUTUPHANE);
    await queryInterface.bulkInsert("Facility_Galleries", [
      {
        facility_id: f1,
        image_url: IMAGE_URLS[0],
        order: 1,
        is_main: true,
      },
      {
        facility_id: f2,
        image_url: IMAGE_URLS[1],
        order: 1,
        is_main: true,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Facility_Galleries", {
      image_url: { [Sequelize.Op.in]: IMAGE_URLS },
    });
  },
};
