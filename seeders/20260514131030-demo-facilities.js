"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Facilities", [
      {
        name: C.FACILITY_NAME_CAKIRLAR,
        address: "Cakirlar Mah. Cumhuriyet Cad. No: 48 Atakum/Samsun",
        latitude: 41.3212345,
        longitude: 36.2887654,
      },  
      {
        name: C.FACILITY_NAME_KUTUPHANE,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      
      {
        name: C.FACILITY_NAME_BANDA,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      
      {
        name: C.FACILITY_NAME_HASAN,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      
      {
        name: C.FACILITY_NAME_MERKEZ,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      
      {
        name: C.FACILITY_NAME_YESILDERE,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_OZGECAN,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_OMER,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_ATAKAFE,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_CEMAL,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_BEL,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_AZIZ,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_ATA,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_ATATEPE,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_ATASAHNE,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_ATAKOCUK,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
      {
        name: C.FACILITY_NAME_AQUA,
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Facilities", {
      name: { [Sequelize.Op.in]: [C.FACILITY_NAME_GENCLIK, C.FACILITY_NAME_KUTUPHANE] },
    });
  },
};
