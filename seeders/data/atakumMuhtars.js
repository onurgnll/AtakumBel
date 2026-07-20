"use strict";

/**
 * Atakum ilçesi mahalle muhtarlıkları — Atakum Belediyesi kaynak verisi.
 * Sadece mahalle adı (Ad) ve muhtar adı (BaskanAdi) kullanılıyor; diğer
 * alanlar (nüfus, yüzölçümü, coğrafi anahtar vb.) bu projede kullanılmıyor.
 * Koordinatı boş olan mahalleler latitude/longitude=null ile eklenir;
 * konum admin panelinden sonradan işaretlenebilir.
 */
const RAW_MUHTARLIKLAR = [
  { Ad: "Akalan", BaskanAdi: "Şaban CİVELEK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Aksu", BaskanAdi: "Yılmaz ÜÇÜNCÜ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Alanlı", BaskanAdi: "Recep KOÇ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Aslandamı", BaskanAdi: "Abdullah TURAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Atakent", BaskanAdi: "Recep Ali YILDIRIM", KoordinatBoylam: "36.24636", KoordinatEnlem: "41.33865" },
  { Ad: "Atakent Güzelyalı", BaskanAdi: "Ülkü KARAKAŞ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Atatepe", BaskanAdi: "Hava RENDECİ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Ayvalı", BaskanAdi: "Ekrem AKSOY", KoordinatBoylam: "36.0333", KoordinatEnlem: "41.2676" },
  { Ad: "Balaç", BaskanAdi: "Salih TÜRKER", KoordinatBoylam: "36.263847", KoordinatEnlem: "41.316628" },
  { Ad: "Beypınar", BaskanAdi: "Yusuf ÇİFTLİK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Büyükkolpınar", BaskanAdi: "Savaş KARA", KoordinatBoylam: "36.2943", KoordinatEnlem: "41.3162" },
  { Ad: "Büyükoyumca", BaskanAdi: "Fatma YİĞİT", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Cumhuriyet", BaskanAdi: "Hüseyin ÇAKMAK", KoordinatBoylam: "36.264388", KoordinatEnlem: "41.336556" },
  { Ad: "Çakırlar", BaskanAdi: "İlhami DENİZ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Çakırlaryalı", BaskanAdi: "Muhittin ÖZTÜRK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Çamlıyazı", BaskanAdi: "Sefer MIRIK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Çatalçam Güzelyurt", BaskanAdi: "Olcay YANIK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Çatmaoluk", BaskanAdi: "Murat KILIÇ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Çobanlı", BaskanAdi: "Recayi ALICI", KoordinatBoylam: "36.248966", KoordinatEnlem: "41.320745" },
  { Ad: "Çobanözü", BaskanAdi: "Abdullah AS", KoordinatBoylam: "36.251061", KoordinatEnlem: "41.31022" },
  { Ad: "Denizevleri", BaskanAdi: "Dursun YİĞİT", KoordinatBoylam: "36.2988", KoordinatEnlem: "41.3287" },
  { Ad: "Elmaçukuru", BaskanAdi: "Selami ÇOLAK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Erikli", BaskanAdi: "Hüseyin SARI", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Esenevler", BaskanAdi: "Ahmet KÖSE", KoordinatBoylam: "36.295566", KoordinatEnlem: "41.325291" },
  { Ad: "Güneyköy", BaskanAdi: "Recep AKKAYA", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "İncesu", BaskanAdi: "Süleyman ARSLAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "İncesu Yalı", BaskanAdi: "Ramazan ZORLU", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "İstiklal", BaskanAdi: "Nurgül DALMAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kabadüz", BaskanAdi: "Recep YALNIZ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kamalı", BaskanAdi: "Abdullah KOPARAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Karakavuk", BaskanAdi: "Mustafa ÜNLÜ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Karaoyumca", BaskanAdi: "Yılmaz ARSLAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kasnakçımermer", BaskanAdi: "Cemal YALÇIN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kayagüney", BaskanAdi: "Abdullah YAZICI", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kesilli", BaskanAdi: "Nurhan AKKUŞ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Köseli", BaskanAdi: "Mustafa KUTLU", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kulacadağ", BaskanAdi: "Yusuf YALÇINKAYA", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kurugökçe", BaskanAdi: "Ali Rıza GÜNDOĞDU", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Kurupelit Körfez", BaskanAdi: "Şevket HATİPOĞLU", KoordinatBoylam: "36.221539", KoordinatEnlem: "41.366538" },
  { Ad: "Küçükkolpınar", BaskanAdi: "Gülümser BEDİR", KoordinatBoylam: "36.287594", KoordinatEnlem: "41.316927" },
  { Ad: "Mevlana", BaskanAdi: "Nafız ER", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Meyvalı", BaskanAdi: "Süleyman SAĞLAM", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Mimarsinan", BaskanAdi: "Erkan ER", KoordinatBoylam: "36.279428", KoordinatEnlem: "41.331603" },
  { Ad: "Özören", BaskanAdi: "Mustafa ÖZTÜRK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Sarayköy", BaskanAdi: "Nuh KARAOĞLAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Sarıışık", BaskanAdi: "Ümit AY", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Sarıtaş", BaskanAdi: "Selamettin ARSLAN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Sarıyusuf", BaskanAdi: "Şaban KARA", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Şenyurt", BaskanAdi: "Şahin KURUBACAK", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Taflan Cami", BaskanAdi: "Mehmet TAŞKARA", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Taflan Merkez Orta", BaskanAdi: "Kemal ÖZSOY", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Taflan Yalı", BaskanAdi: "Kemal KÖKSAL", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Yenimahalle", BaskanAdi: "Sezgin KAYGUSUZ", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Yeşildere", BaskanAdi: "Yasin BAKMAZ", KoordinatBoylam: "36.3053", KoordinatEnlem: "41.3159" },
  { Ad: "Yeşiltepe", BaskanAdi: "Mustafa DURSUN", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Yeşilyurt", BaskanAdi: "Süleyman KURT", KoordinatBoylam: "", KoordinatEnlem: "" },
  { Ad: "Yukarıaksu", BaskanAdi: "İlhami ARSLAN", KoordinatBoylam: "", KoordinatEnlem: "" },
];

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] };
  return {
    first_name: parts.slice(0, -1).join(" "),
    last_name: parts[parts.length - 1],
  };
}

function toCoord(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

module.exports.ATAKUM_MUHTARS = RAW_MUHTARLIKLAR.map((m, index) => {
  const { first_name, last_name } = splitName(m.BaskanAdi);
  return {
    mahalle_name: m.Ad.trim(),
    first_name,
    last_name,
    address: null,
    phone: null,
    email: null,
    latitude: toCoord(m.KoordinatEnlem),
    longitude: toCoord(m.KoordinatBoylam),
    image_url: null,
    order: index,
  };
});
