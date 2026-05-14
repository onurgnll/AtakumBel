"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Presidents", [
      {
        first_name: C.PRESIDENT_FIRST,
        last_name: C.PRESIDENT_LAST,
        "biography": "1983 yılında Almanya'da dünyaya gelen Serhat Türkel, 1 yaşında ailesiyle birlikte Samsun'un Atakum ilçesine yerleşti. İlk, orta ve lise eğitimini Atakum'da tamamlayan Türkel, ardından Ondokuz Mayıs Üniversitesi İktisadi ve İdari Bilimler Fakültesi'nden mezun oldu. 2008 yılında siyasi yaşamına CHP'nin gençlik kollarında başlayan Türkel, 2015–2019 yılları arasında CHP Atakum İlçe Yönetim Kurulu Üyesi olarak görev yaptı. 2009 yılında reklam sektörüne adım atan Türkel, 2014 yılında ise otelcilik alanında girişimci oldu. 31 Mart 2024 yerel seçimlerinde Atakum Belediye Başkanı seçilen Serhat Türkel, evli ve iki çocuk babasıdır.",
        "message": "Atakum'u birlikte yonetiyor; sosyal belediyecilik anlayisiyla her mahalleye esit hizmet goturuyoruz.",
        "president_image_url": "/uploads/president/1778230183495-652602229.jpg",
        "social_media_accounts": [
            {
                "url": "https://www.instagram.com/atakumbelediyesi",
                "platform": "Instagram"
            },
            {
                "url": "https://x.com/atakumbelediye",
                "platform": "X"
            },
            {
                "url": "https://www.youtube.com/@atakumbelediyesi",
                "platform": "YouTube"
            },
            {
                "url": "asdasdasd",
                "platform": "Facebook"
            }
        ],
        "birth_place": "Almanya",
        "birth_year": 1983,
        "grown_place": "Atakum / Samsun",
        "marital_status": "Evli",
        "education": [
            {
                "year": "2002",
                "title": "Lise",
                "description": "",
                "institution": "Samsun Anadolu Lisesi"
            },
            {
                "year": "2006",
                "title": "Lisans — İktisadi ve İdari Bilimler",
                "description": "",
                "institution": "Ondokuz Mayıs Üniversitesi, Samsun"
            }
        ],
        "political_career": [
            {
                "title": "CHP Gençlik Kolları Üyesi",
                "period": "2008",
                "description": "Gençlik kollarında aktif çalışarak siyasi yaşamına başladı.",
                "institution": "CHP Atakum İlçe Teşkilatı"
            },
            {
                "title": "İlçe Yönetim Kurulu Üyesi",
                "period": "2015-2019",
                "description": "Atakum ilçe teşkilatı yönetim kurulunda görev üstlenerek yerel siyasette etkin rol oynadı. 38. Olağan Kongre'de ilçe başkanlığı seçimine katıldı.",
                "institution": "CHP Atakum İlçe Teşkilatı"
            },
            {
                "title": "Atakum Belediye Başkanı",
                "period": "2024",
                "description": "31 Mart 2024 yerel seçimlerinde Atakum halkının oylarıyla seçildi",
                "institution": "T.C. Atakum Belediyesi"
            }
        ],
        "work_life": [
            {
                "year": "2014",
                "title": "Otelcilik & Turizm",
                "location": "Samsun",
                "description": "Turizm ve konaklama sektöründe işletmecilik faaliyetleri yürüttü."
            },
            {
                "year": "2009",
                "title": " Reklamcılık & İletişim",
                "location": "Samsun",
                "description": "Reklam sektörüne adım atarak iletişim ve tanıtım alanında girişimci olarak yer aldı."
            }
        ],
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Presidents", {
      first_name: C.PRESIDENT_FIRST,
      last_name: C.PRESIDENT_LAST,
    });
  },
};
