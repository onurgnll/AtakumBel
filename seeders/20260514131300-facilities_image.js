"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { facilityIdByName } = require("./lib/seedHelpers");

const GALLERIES = [
  {
    facilityName: C.FACILITY_NAME_CAKIRLAR,
    images: ["/uploads/facility-gallery/cakirlar.jpg"],
  },
  {
    facilityName: C.FACILITY_NAME_KUTUPHANE,
    images: [
      "/uploads/facility-gallery/kutuphane_1.jpeg",
      "/uploads/facility-gallery/kutuphane_2.jpeg",
      "/uploads/facility-gallery/kutuphane_3.jpeg",
      "/uploads/facility-gallery/kutuphane_4.jpeg",
      "/uploads/facility-gallery/kutuphane_5.jpeg",
      "/uploads/facility-gallery/kutuphane_6.jpeg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_BANDA,
    images: [
      "/uploads/facility-gallery/banda_1.jpg",
      "/uploads/facility-gallery/banda_2.jpg",
      "/uploads/facility-gallery/banda_3.jpg",
      "/uploads/facility-gallery/banda_4.jpg",
      "/uploads/facility-gallery/banda_5.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_HASAN,
    images: ["/uploads/facility-gallery/hasan.jpeg"],
  },
  {
    facilityName: C.FACILITY_NAME_MERKEZ,
    images: ["/uploads/facility-gallery/merkez.jpg"],
  },
  {
    facilityName: C.FACILITY_NAME_YESILDERE,
    images: [
      "/uploads/facility-gallery/yesildere_1.jpg",
      "/uploads/facility-gallery/yesildere_2.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_OZGECAN,
    images: [
      "/uploads/facility-gallery/ozgecan_1.jpg",
      "/uploads/facility-gallery/ozgecan_2.jpg",
      "/uploads/facility-gallery/ozgecan_3.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_OMER,
    images: ["/uploads/facility-gallery/omer.jpg"],
  },
  {
    facilityName: C.FACILITY_NAME_ATAKAFE,
    images: ["/uploads/facility-gallery/atakafe.jpg"],
  },
  {
    facilityName: C.FACILITY_NAME_CEMAL,
    images: [
      "/uploads/facility-gallery/cemal_1.jpg",
      "/uploads/facility-gallery/cemal_2.jpg",
      "/uploads/facility-gallery/cemal_3.jpg",
      "/uploads/facility-gallery/cemal_4.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_BEL,
    images: [
      "/uploads/facility-gallery/bel_1.jpg",
      "/uploads/facility-gallery/bel_2.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_AZIZ,
    images: [
      "/uploads/facility-gallery/aziz_1.jpg",
      "/uploads/facility-gallery/aziz_2.jpg",
      "/uploads/facility-gallery/aziz_3.jpg",
      "/uploads/facility-gallery/aziz_4.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_ATA,
    images: [
      "/uploads/facility-gallery/ata_1.jpg",
      "/uploads/facility-gallery/ata_2.jpg",
      "/uploads/facility-gallery/ata_3.jpg",
      "/uploads/facility-gallery/ata_4.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_ATATEPE,
    images: [
      "/uploads/facility-gallery/atatepe_1.jpg",
      "/uploads/facility-gallery/atatepe_2.jpg",
      "/uploads/facility-gallery/atatepe_3.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_ATASAHNE,
    images: [
      "/uploads/facility-gallery/atasahne_1.jpg",
      "/uploads/facility-gallery/atasahne_2.jpg",
      "/uploads/facility-gallery/atasahne_3.jpg",
      "/uploads/facility-gallery/atasahne_4.jpg",
      "/uploads/facility-gallery/atasahne_5.jpg",
      "/uploads/facility-gallery/atasahne_6.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_ATAKOCUK,
    images: [
      "/uploads/facility-gallery/atacocuk_1.jpg",
      "/uploads/facility-gallery/atacocuk_2.jpg",
      "/uploads/facility-gallery/atacocuk_3.jpg",
      "/uploads/facility-gallery/atacocuk_4.jpg",
      "/uploads/facility-gallery/atacocuk_5.jpg",
      "/uploads/facility-gallery/atacocuk_6.jpg",
      "/uploads/facility-gallery/atacocuk_7.jpg",
      "/uploads/facility-gallery/atacocuk8.jpg",
      "/uploads/facility-gallery/atacocuk_9.jpg",
      "/uploads/facility-gallery/atacocuk_10.jpg",
      "/uploads/facility-gallery/atacocuk_11.jpg",
      "/uploads/facility-gallery/atacocuk_12.jpg",
    ],
  },
  {
    facilityName: C.FACILITY_NAME_AQUA,
    images: ["/uploads/facility-gallery/aqua.jpg"],
  },
];

const IMAGE_URLS = GALLERIES.flatMap((gallery) => gallery.images);

module.exports = {
  async up(queryInterface) {
    const rows = [];

    for (const gallery of GALLERIES) {
      const facilityId = await facilityIdByName(
        queryInterface,
        gallery.facilityName,
      );

      rows.push(
        ...gallery.images.map((imageUrl, index) => ({
          facility_id: facilityId,
          image_url: imageUrl,
          order: index + 1,
          is_main: index === 0,
        })),
      );
    }

    await queryInterface.bulkInsert("Facility_Galleries", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Facility_Galleries", {
      image_url: { [Sequelize.Op.in]: IMAGE_URLS },
    });
  },
};
