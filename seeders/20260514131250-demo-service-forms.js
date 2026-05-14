"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");
const { serviceIdByName } = require("./lib/seedHelpers");

const FORM_NAMES = ["ASANSÖR PERİYODİK TAKİP KONTROL BAŞVURU FORMU","ASANSÖR TESCİL ÖNCESİ İLK PERİYODİK KONTROL BAŞVURU FORMU", "Nikah İşlemleri Formu", "İşyeri Ruhsatları Formu", "Zabıta Hizmetleri Formu", "Yapı Ruhsat Onayı Formu", "Paylaşım Merkezi (PAYMER) Projesi Formu", "Evde Destek Hizmetleri Formu"];

module.exports = {
  async up(queryInterface) {
    const asansorServiceId = await serviceIdByName(queryInterface, C.SERVICE_NAME_ASANSOR);
    await queryInterface.bulkInsert("Service_Forms", [
      {
        service_id: asansorServiceId,
        form_name: FORM_NAMES[0],
        file_path: "/uploads/service-forms/asansor_periyodik_takip.pdf",
      },
      {
        service_id: asansorServiceId,
        form_name: FORM_NAMES[1],
        file_path: "/uploads/service-forms/tescil_oncesi.pdf",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Service_Forms", { form_name: { [Sequelize.Op.in]: FORM_NAMES } });
  },
};
