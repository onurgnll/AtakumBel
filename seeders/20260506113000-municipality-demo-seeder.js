"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Departments", [
      {
        id: 1001,
        name: "Fen Isleri Mudurlugu",
        description:
          "Yol, kaldirim, bakim-onarim ve altyapi koordinasyon faaliyetlerini yurutur.",
        phone: "+90 362 111 00 01",
        address: "Atakum Belediye Hizmet Binasi 2. Kat",
      },
      {
        id: 1002,
        name: "Temizlik Isleri Mudurlugu",
        description:
          "Ilce genelinde temizlik, atik toplama ve sifir atik uygulamalarini koordine eder.",
        phone: "+90 362 111 00 02",
        address: "Atakum Belediye Hizmet Binasi Zemin Kat",
      },
      {
        id: 1003,
        name: "Kultur ve Sosyal Isler Mudurlugu",
        description:
          "Kultur, sanat, spor ve sosyal destek programlarini planlayip uygular.",
        phone: "+90 362 111 00 03",
        address: "Atakum Kultur Merkezi",
      },
    ]);

    await queryInterface.bulkInsert("Services", [
      {
        id: 1001,
        name: "Online Imar Durumu Belgesi",
        content:
          "Vatandaslarin e-belediye uzerinden imar durumu belgesi basvurusu yapmasini saglar.",
        image_url: "/uploads/services/imar-durumu.jpg",
      },
      {
        id: 1002,
        name: "Evsel Atik Toplama Takibi",
        content:
          "Mahalle bazli atik toplama gun ve saatlerinin dijital olarak takip edilmesini saglar.",
        image_url: "/uploads/services/atik-toplama.jpg",
      },
      {
        id: 1003,
        name: "Sosyal Destek Basvurusu",
        content:
          "Ihtiyac sahibi vatandaslarin sosyal yardim taleplerini online iletebilmesini saglar.",
        image_url: "/uploads/services/sosyal-destek.jpg",
      },
    ]);

    await queryInterface.bulkInsert("Facilities", [
      {
        id: 1001,
        name: "Atakum Genclik Merkezi",
        address: "Denizevleri Mah. Cumhuriyet Cad. No: 48 Atakum/Samsun",
        latitude: 41.3212345,
        longitude: 36.2887654,
      },
      {
        id: 1002,
        name: "Hasan Ali Yucel Cocuk Kutuphanesi",
        address: "Yeni Mah. 3072. Sok. No: 12 Atakum/Samsun",
        latitude: 41.3256789,
        longitude: 36.2954321,
      },
    ]);

    await queryInterface.bulkInsert("Presidents", [
      {
        id: 1001,
        first_name: "Murat",
        last_name: "Topaloglu",
        biography:
          "Yerel yonetimlerde seffaflik, katilimcilik ve surdurulebilir kentlesme odakli calismalar yuruten belediye baskanidir.",
        message:
          "Atakum'u birlikte yonetiyor; sosyal belediyecilik anlayisiyla her mahalleye esit hizmet goturuyoruz.",
        president_image_url: "/uploads/president/baskan.jpg",
        social_media_accounts: JSON.stringify([
          {
            platform: "Instagram",
            url: "https://www.instagram.com/atakumbelediyesi",
          },
          { platform: "X", url: "https://x.com/atakumbelediye" },
          { platform: "YouTube", url: "https://www.youtube.com/@atakumbelediyesi" },
        ]),
      },
    ]);

    await queryInterface.bulkInsert("Encumens", [
      {
        id: 1001,
        term_name: "2026 Yili Encumen Donemi",
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert("Directives", [
      {
        id: 1001,
        title: "Yapi Kontrol ve Ruhsat Islemleri Yonergesi",
        description:
          "Ruhsat basvurularinda belge kontrol surecini hizlandirmaya yonelik uygulama esaslarini belirler.",
        publish_date: "2026-02-15",
      },
      {
        id: 1002,
        title: "Sifir Atik Uygulama Yonergesi",
        description:
          "Kamu binalari ve mahalle toplama noktalarinda atik ayristirma standartlarini tanimlar.",
        publish_date: "2026-03-20",
      },
    ]);

    await queryInterface.bulkInsert("Activity_Reports", [
      {
        id: 1001,
        title: "2025 Faaliyet Raporu",
        description: "Belediyenin 2025 yilinda gerceklestirdigi faaliyetlerin ozeti.",
        publish_date: "2026-01-15",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2025-faaliyet-raporu.pdf"]),
      },
    ]);

    await queryInterface.bulkInsert("Financial_Expectation_Reports", [
      {
        id: 1001,
        title: "2026 Mali Durum Beklenti Raporu",
        description: "Gelir-gider beklentilerine iliskin mali degerlendirme raporu.",
        publish_date: "2026-02-10",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2026-mali-beklenti.pdf"]),
      },
    ]);

    await queryInterface.bulkInsert("Performance_Programs", [
      {
        id: 1001,
        title: "2026 Performans Programi",
        description: "Kurumsal hedefler ve performans gostergeleri.",
        publish_date: "2026-01-20",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2026-performans-programi.pdf"]),
      },
    ]);

    await queryInterface.bulkInsert("Audit_Reports", [
      {
        id: 1001,
        title: "2025 Ic Denetim Raporu",
        description: "Ic denetim surecleri ve bulgularin ozet raporu.",
        publish_date: "2026-03-05",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2025-ic-denetim.pdf"]),
      },
    ]);

    await queryInterface.bulkInsert("Strategic_Plans", [
      {
        id: 1001,
        title: "2025-2029 Stratejik Plan",
        description: "Orta vadeli stratejik hedefleri iceren plan dokumani.",
        publish_date: "2026-01-10",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/2025-2029-stratejik-plan.pdf"]),
      },
    ]);

    await queryInterface.bulkInsert("Kvkk_Documents", [
      {
        id: 1001,
        title: "KVKK Aydinlatma Metni",
        description: "Kisisel verilerin islenmesine iliskin bilgilendirme metni.",
        publish_date: "2026-02-01",
        is_active: true,
        files: JSON.stringify(["/uploads/reports/kvkk-aydinlatma-metni.pdf"]),
      },
    ]);

    await queryInterface.bulkInsert("News", [
      {
        id: 1001,
        title: "Atakum Sahil Duzenleme Calismalari Basladi",
        spot: "Sahil bandinda yesil alan ve yaya akslari yenileniyor.",
        content:
          "Fen Isleri Mudurlugu koordinasyonunda sahil duzenleme projesi etaplar halinde hayata geciriliyor.",
        publish_date: now,
        is_active: true,
        view_count: 2450,
      },
      {
        id: 1002,
        title: "Mahallelerde Ucretsiz Yaz Spor Okullari Acildi",
        spot: "Cocuk ve gencler icin 8 farkli spor bransinda egitim verilecek.",
        content:
          "Kultur ve Sosyal Isler Mudurlugu tarafindan yaz doneminde spor etkinlikleri ilce geneline yayildi.",
        publish_date: now,
        is_active: true,
        view_count: 1780,
      },
    ]);

    await queryInterface.bulkInsert("Events", [
      {
        id: 1001,
        title: "Atakum Cocuk Senligi",
        type: "activity",
        start_date: "2026-06-10",
        end_date: "2026-06-10",
        event_time: "14:00:00",
        address: "Atakum Kent Meydani",
        description:
          "Atolye, sahne gosteri ve oyun alanlariyla tum cocuklara acik belediye etkinligi.",
      },
      {
        id: 1002,
        title: "Sahil Kosusu 10K",
        type: "competition",
        start_date: "2026-07-05",
        end_date: "2026-07-05",
        event_time: "09:00:00",
        address: "Atakum Sahil Yolu Baslangic Noktasi",
        description:
          "Amator ve profesyonel sporculara acik 10K sahil kosusu organizasyonu.",
      },
    ]);

    await queryInterface.bulkInsert("Suggestions", [
      {
        id: 1001,
        project_name: "Mahalle Kompost Noktalari",
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

    await queryInterface.bulkInsert("Press_Materials", [
      {
        id: 1001,
        title: "Kurumsal Logo Paketi",
        description: "Basin ve medya kullanimina uygun logo dosyalari.",
        publish_date: "2026-01-05",
        is_active: true,
        files: JSON.stringify(["/uploads/press/atakum-kurumsal-logo.png"]),
        file_url: "/uploads/press/atakum-kurumsal-logo.png",
      },
      {
        id: 1002,
        title: "Basin Kiti 2026",
        description: "Kurumsal basin materyali arsivi.",
        publish_date: "2026-02-15",
        is_active: true,
        files: JSON.stringify(["/uploads/press/basin-kiti-2026.zip"]),
        file_url: "/uploads/press/basin-kiti-2026.zip",
      },
    ]);

    await queryInterface.bulkInsert("Employees", [
      {
        id: 1001,
        first_name: "Emre",
        last_name: "Yilmaz",
        title: "Yol Bakim Birim Sefi",
        department_id: 1001,
        dahili_no: "2101",
        image_url: "/uploads/employees/emre-yilmaz.jpg",
        is_unit_manager: true,
        is_contact_person: true,
        is_active: true,
      },
      {
        id: 1002,
        first_name: "Zeynep",
        last_name: "Kara",
        title: "Temizlik Programlama Uzmani",
        department_id: 1002,
        dahili_no: "2203",
        image_url: "/uploads/employees/zeynep-kara.jpg",
        is_unit_manager: false,
        is_contact_person: true,
        is_active: true,
      },
      {
        id: 1003,
        first_name: "Hasan",
        last_name: "Aydin",
        title: "Sosyal Projeler Koordinatoru",
        department_id: 1003,
        dahili_no: "2302",
        image_url: "/uploads/employees/hasan-aydin.jpg",
        is_unit_manager: true,
        is_contact_person: false,
        is_active: true,
      },
    ]);

    await queryInterface.bulkInsert("Vice_Presidents", [
      {
        id: 1001,
        first_name: "Selim",
        last_name: "Demir",
        biography:
          "Altyapi ve ustyapi projelerinde belediye birimleri arasinda koordinasyon gorevini yurutur.",
        image_url: "/uploads/vice-presidents/selim-demir.jpg",
        department_id: 1001,
      },
      {
        id: 1002,
        first_name: "Aylin",
        last_name: "Cetin",
        biography:
          "Sosyal hizmetler, kultur-sanat etkinlikleri ve vatandas odakli projelerden sorumludur.",
        image_url: "/uploads/vice-presidents/aylin-cetin.jpg",
        department_id: 1003,
      },
    ]);

    await queryInterface.bulkInsert("Council_Members", [
      {
        id: 1001,
        first_name: "Ahmet",
        last_name: "Sahin",
        political_party: "CHP",
        image_url: "/uploads/council-members/ahmet-sahin.jpg",
      },
      {
        id: 1002,
        first_name: "Merve",
        last_name: "Tas",
        political_party: "AK Parti",
        image_url: "/uploads/council-members/merve-tas.jpg",
      },
    ]);

    await queryInterface.bulkInsert("Council_Decisions", [
      {
        id: 1001,
        title: "Meclis Karari - Sahil Duzenleme",
        description: "Sahil duzenleme projesi 1. etap karar aciklamasi.",
        publish_date: "2026-04-12",
        is_active: true,
        files: JSON.stringify(["/uploads/council-decisions/karar-1001.pdf"]),
        decision_no: "2026/41",
        summary: "Atakum Sahil Duzenleme Projesi 1. Etap Onayi",
        full_text:
          "Proje kapsaminda yaya yolu, bisiklet yolu ve peyzaj duzenlemelerinin ihale surecine cikilmasina karar verildi.",
        date: "2026-04-12",
      },
      {
        id: 1002,
        title: "Meclis Karari - Sosyal Destek",
        description: "Sosyal destek butce revizyon karari.",
        publish_date: "2026-04-30",
        is_active: true,
        files: JSON.stringify(["/uploads/council-decisions/karar-1002.pdf"]),
        decision_no: "2026/58",
        summary: "Sosyal Destek Programi Butce Revizyonu",
        full_text:
          "Ihtiyac sahibi ailelere yonelik destek kalemlerinin genisletilmesine ve ek butce ayrilmasina karar verildi.",
        date: "2026-04-30",
      },
    ]);

    await queryInterface.bulkInsert("Public_Notices", [
      {
        id: 1001,
        title: "Sahil Duzenleme Yapim Isi Ihale Ilani",
        description: "Sahil duzenleme yapim isi duyuru aciklamasi.",
        publish_date: "2026-05-01",
        is_active: true,
        files: JSON.stringify(["/uploads/notices/sahil-duzenleme-ihale.pdf"]),
        content:
          "Sahil duzenleme etap-1 yapim isi icin acik ihale usulu ile teklif alinacaktir.",
        status: "upcoming",
        start_date: "2026-05-01",
        end_date: "2026-06-05",
        file_url: "/uploads/notices/sahil-duzenleme-ihale.pdf",
        department_id: 1001,
        decision_id: 1001,
      },
      {
        id: 1002,
        title: "Sosyal Destek Basvuru Takvimi",
        description: "Sosyal destek programi basvuru duyurusu.",
        publish_date: "2026-06-01",
        is_active: true,
        files: JSON.stringify(["/uploads/notices/sosyal-destek-takvim.pdf"]),
        content:
          "2026 yili sosyal destek programi basvuru takvimi ve gerekli belgeler ilan edilmistir.",
        status: "on_hold",
        start_date: "2026-06-01",
        end_date: "2026-06-30",
        file_url: "/uploads/notices/sosyal-destek-takvim.pdf",
        department_id: 1003,
        decision_id: 1002,
      },
    ]);

    await queryInterface.bulkInsert("Tenders", [
      {
        id: 1001,
        title: "Ihale Ilani - Sahil Duzenleme",
        description: "Sahil duzenleme ihale ilani.",
        publish_date: "2026-05-20",
        is_active: true,
        files: JSON.stringify(["/uploads/tenders/ihale-1001.pdf"]),
        department_id: 1001,
        start_date: "2026-05-20",
        end_date: "2026-06-05",
        tender_number: "ATK-2026-001",
      },
      {
        id: 1002,
        title: "Ihale Ilani - Sosyal Destek Hizmeti",
        description: "Sosyal destek hizmeti ihale duyurusu.",
        publish_date: "2026-06-01",
        is_active: true,
        files: JSON.stringify(["/uploads/tenders/ihale-1002.pdf"]),
        department_id: 1003,
        start_date: "2026-06-01",
        end_date: "2026-06-15",
        tender_number: "ATK-2026-002",
      },
    ]);

    await queryInterface.bulkInsert("Vice_President_Departments", [
      {
        vice_president_id: 1001,
        department_id: 1001,
        created_at: now,
        updated_at: now,
      },
      {
        vice_president_id: 1001,
        department_id: 1002,
        created_at: now,
        updated_at: now,
      },
      {
        vice_president_id: 1002,
        department_id: 1003,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkUpdate(
      "Departments",
      { manager_employee_id: 1001 },
      { id: 1001 },
    );
    await queryInterface.bulkUpdate(
      "Departments",
      { manager_employee_id: 1002 },
      { id: 1002 },
    );
    await queryInterface.bulkUpdate(
      "Departments",
      { manager_employee_id: 1003 },
      { id: 1003 },
    );

    await queryInterface.bulkInsert("Service_Forms", [
      {
        id: 1001,
        service_id: 1001,
        form_name: "Imar Durumu Basvuru Formu",
        file_path: "/uploads/service-forms/imar-durumu-formu.pdf",
      },
      {
        id: 1002,
        service_id: 1003,
        form_name: "Sosyal Destek On Basvuru Formu",
        file_path: "/uploads/service-forms/sosyal-destek-formu.pdf",
      },
    ]);

    await queryInterface.bulkInsert("President_Galleries", [
      {
        id: 1001,
        president_id: 1001,
        image_url: "/uploads/president-gallery/baskan-1.jpg",
        order: 1,
        is_main: true,
      },
      {
        id: 1002,
        president_id: 1001,
        image_url: "/uploads/president-gallery/baskan-2.jpg",
        order: 2,
        is_main: false,
      },
    ]);

    await queryInterface.bulkInsert("News_Galleries", [
      {
        id: 1001,
        news_id: 1001,
        image_url: "/uploads/news-gallery/sahil-1.jpg",
        order: 1,
        is_main: true,
      },
      {
        id: 1002,
        news_id: 1002,
        image_url: "/uploads/news-gallery/spor-okullari-1.jpg",
        order: 1,
        is_main: true,
      },
    ]);

    await queryInterface.bulkInsert("Event_Galleries", [
      {
        id: 1001,
        event_id: 1001,
        image_url: "/uploads/event-gallery/cocuk-senligi-1.jpg",
        order: 1,
        is_main: true,
      },
      {
        id: 1002,
        event_id: 1002,
        image_url: "/uploads/event-gallery/sahil-kosusu-1.jpg",
        order: 1,
        is_main: true,
      },
    ]);

    await queryInterface.bulkInsert("Facility_Galleries", [
      {
        id: 1001,
        facility_id: 1001,
        image_url: "/uploads/facility-gallery/genclik-merkezi-1.jpg",
        order: 1,
        is_main: true,
      },
      {
        id: 1002,
        facility_id: 1002,
        image_url: "/uploads/facility-gallery/kutuphane-1.jpg",
        order: 1,
        is_main: true,
      },
    ]);

    await queryInterface.bulkInsert("Encumen_Memberships", [
      {
        id: 1001,
        encumen_id: 1001,
        member_type: "staff",
        member_id: 1001,
      },
      {
        id: 1002,
        encumen_id: 1001,
        member_type: "council_member",
        member_id: 1001,
      },
    ]);

    await queryInterface.bulkInsert("GatheringAreas", [
      {
        id: 1001,
        name: "Sahil Toplanma Alani",
        latitude: 41.3201000,
        longitude: 36.2865000,
      },
      {
        id: 1002,
        name: "Kent Meydani Toplanma Alani",
        latitude: 41.3218000,
        longitude: 36.2902000,
      },
    ]);

    await queryInterface.bulkInsert("FreeWifiPoints", [
      {
        id: 1001,
        name: "Atakum Sahil Ucretsiz WiFi",
        latitude: 41.3195000,
        longitude: 36.2859000,
      },
      {
        id: 1002,
        name: "Atakum Kent Meydani Ucretsiz WiFi",
        latitude: 41.3223000,
        longitude: 36.2897000,
      },
    ]);

    await queryInterface.bulkInsert("WastePoints", [
      {
        id: 1001,
        name: "Sifir Atik Getirme Merkezi",
        latitude: 41.3234000,
        longitude: 36.2921000,
      },
      {
        id: 1002,
        name: "Cam Atik Kumbarasi - Sahil",
        latitude: 41.3189000,
        longitude: 36.2848000,
      },
    ]);

    await queryInterface.bulkInsert("Marketplaces", [
      {
        id: 1001,
        name: "Cumartesi Pazari",
        latitude: 41.3245000,
        longitude: 36.2933000,
        day_of_week: "Saturday",
      },
      {
        id: 1002,
        name: "Carsamba Pazari",
        latitude: 41.3178000,
        longitude: 36.2819000,
        day_of_week: "Wednesday",
      },
    ]);

    await queryInterface.bulkInsert("Real_Estate_Listings", [
      {
        id: 1001,
        title: "Satilik Belediye Arsasi",
        description: "Atakum ilcesinde satilik arsa ilanidir.",
        publish_date: "2026-06-12",
        is_active: true,
        files: JSON.stringify(["/uploads/real-estate/arsa-1001.pdf"]),
      },
      {
        id: 1002,
        title: "Kiralik Belediye Is Yeri",
        description: "Merkezi konumda kiralik is yeri ilanidir.",
        publish_date: "2026-06-15",
        is_active: true,
        files: JSON.stringify(["/uploads/real-estate/isyeri-1002.pdf"]),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Encumen_Memberships", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Facility_Galleries", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Event_Galleries", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("News_Galleries", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("President_Galleries", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Service_Forms", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Tenders", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Vice_President_Departments", {
      vice_president_id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Public_Notices", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Council_Decisions", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Council_Members", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Vice_Presidents", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Employees", {
      id: {
        [Sequelize.Op.in]: [1001, 1002, 1003],
      },
    });
    await queryInterface.bulkDelete("Press_Materials", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Suggestions", {
      id: 1001,
    });
    await queryInterface.bulkDelete("Events", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("News", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Kvkk_Documents", {
      id: { [Sequelize.Op.in]: [1001] },
    });
    await queryInterface.bulkDelete("Strategic_Plans", {
      id: { [Sequelize.Op.in]: [1001] },
    });
    await queryInterface.bulkDelete("Audit_Reports", {
      id: { [Sequelize.Op.in]: [1001] },
    });
    await queryInterface.bulkDelete("Performance_Programs", {
      id: { [Sequelize.Op.in]: [1001] },
    });
    await queryInterface.bulkDelete("Financial_Expectation_Reports", {
      id: { [Sequelize.Op.in]: [1001] },
    });
    await queryInterface.bulkDelete("Activity_Reports", {
      id: { [Sequelize.Op.in]: [1001] },
    });
    await queryInterface.bulkDelete("Directives", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Encumens", {
      id: 1001,
    });
    await queryInterface.bulkDelete("Presidents", {
      id: 1001,
    });
    await queryInterface.bulkDelete("Facilities", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Services", {
      id: {
        [Sequelize.Op.in]: [1001, 1002, 1003],
      },
    });
    await queryInterface.bulkDelete("Departments", {
      id: {
        [Sequelize.Op.in]: [1001, 1002, 1003],
      },
    });
    await queryInterface.bulkDelete("Real_Estate_Listings", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("Marketplaces", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("WastePoints", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("FreeWifiPoints", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
    await queryInterface.bulkDelete("GatheringAreas", {
      id: {
        [Sequelize.Op.in]: [1001, 1002],
      },
    });
  },
};
