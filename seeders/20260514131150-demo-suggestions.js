"use strict";

const PROJECT = "Mahalle Kompost Noktalari";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Suggestions", [
      {
        project_name: PROJECT,
        project_purpose:
          "Organik atiklarin degerlendirilmesi ve mahalle bazli cevresel farkindaligin artirilmasi.",
        application_duration: "6 ay",
        total_budget: "1.250.000 TL",
        location: "Denizevleri, Mimarsinan ve Esenevler mahalleleri",
        stakeholders: "Muhtarliklar, okul yonetimleri, cevre topluluklari",
        beneficiaries: "Hane halki, ogrenciler ve yerel esnaf",
        main_activities:
          "Kompost alan kurulumu, egitim toplantilari ve aylik performans izlemesi",
        expected_results:
          "Organik atikta azalma, mahallelerde cevre bilincinin artmasi",
        status: "reviewed",
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Suggestions", { project_name: PROJECT });
  },
};
