"use strict";

/**
 * atakum.bel.tr birim detay sayfalarından veri üretir.
 * Çıktı: seeders/data/atakumBirimGenerated.js
 * Çalıştırma: node scripts/build-atakum-birim-seed-data.cjs
 */

const fs = require("fs");
const path = require("path");

const SLUGS = [
  "afet-isleri-ve-risk-yonetim-mudurlugu",
  "basin-yayin-ve-halkla-iliskiler-mudurlugu",
  "bilgi-islem-mudurlugu",
  "cevre-koruma-mudurlugu",
  "destek-hizmetleri-mudurlugu",
  "emlak-ve-istimlak-mudurlugu",
  "etud-mudurlugu",
  "fen-isleri-mudurlugu",
  "gelirler-mudurlugu",
  "genclik-ve-spor-hizmetleri-mudurlugu",
  "hukuk-isleri-mudurlugu",
  "iklim-mudurlugu",
  "imar-ve-sehircilik-mudurlugu",
  "insan-kaynaklari-mudurlugu",
  "isletme-ve-istiraklar-mudurlugu",
  "kadin-ve-aile-hizmetleri-mudurugu",
  "kirsal-hizmetler-mudurlugu",
  "kultur-sanat-ve-sosyal-isler-mudurlugu",
  "makine-ikmal-bakim-ve-onarim-mudurlugu",
  "mali-hizmetler-mudurlugu",
  "ozel-kalem-mudurlugu",
  "park-ve-bahceler-mudurlugu",
  "plan-ve-proje-mudurlugu",
  "rehberlik-ve-teftis-kurulu-mudurlugu",
  "ruhsat-denetim-mudurlugu",
  "saglik-isler-mudurlugu",
  "sosyal-hizmetler-mudurlugu",
  "temizlik-isleri-mudurlugu",
  "veteriner-isleri-mudurlugu",
  "yapi-kontrol-mudurlugu",
  "yazi-isleri-mudurlugu",
  "zabita-mudurlugu",
];

const TITLE_NAMES = [
  "Afet İşleri ve Risk Yönetimi Müdürlüğü",
  "Basın Yayın ve Halkla İlişkiler Müdürlüğü",
  "Bilgi İşlem Müdürlüğü",
  "Çevre Koruma ve Kontrol Müdürlüğü",
  "Destek Hizmetleri Müdürlüğü",
  "Emlak ve İstimlak Müdürlüğü",
  "Etüd Proje Müdürlüğü",
  "Fen İşleri Müdürlüğü",
  "Gelirler Müdürlüğü",
  "Gençlik ve Spor Hizmetleri Müdürlüğü",
  "Hukuk İşleri Müdürlüğü",
  "İklim Değişikliği ve Sıfır Atık Müdürlüğü",
  "İmar ve Şehircilik Müdürlüğü",
  "İnsan Kaynakları ve Eğitim Müdürlüğü",
  "İşletme ve İştirakler Müdürlüğü",
  "Kadın ve Aile Hizmetleri Müdürlüğü",
  "Kırsal Hizmetler Müdürlüğü",
  "Kültür Sanat ve Sosyal İşler Müdürlüğü",
  "Makine İkmal Bakım ve Onarım Müdürlüğü",
  "Mali Hizmetler Müdürlüğü",
  "Özel Kalem Müdürlüğü",
  "Park ve Bahçeler Müdürlüğü",
  "Plan ve Proje Müdürlüğü",
  "Rehberlik ve Teftiş Kurulu Müdürlüğü",
  "Ruhsat ve Denetim Müdürlüğü",
  "Sağlık İşleri Müdürlüğü",
  "Sosyal Hizmetler Müdürlüğü",
  "Temizlik İşleri Müdürlüğü",
  "Veteriner İşleri Müdürlüğü",
  "Yapı Kontrol Müdürlüğü",
  "Yazı İşleri Müdürlüğü",
  "Zabıta Müdürlüğü",
];

function parsePeopleFromHtml(html) {
  const people = [];
  const re =
    /<h5 class="card-title">([^<]+)<\/h5>[\s\S]*?<b>Görevi:<\/b>\s*([^<]+)<br>\s*<b>Dahili No:<\/b>\s*([^<\s]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    const fullName = m[1].trim().replace(/\s+/g, " ");
    const title = m[2].trim().replace(/\s+/g, " ");
    const dahili_no = m[3].trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length < 2) continue;
    people.push({
      first_name: parts[0],
      last_name: parts.slice(1).join(" "),
      title,
      dahili_no,
    });
  }
  return people;
}

function parseDeptFromHtml(html) {
  let description =
    "T.C. Atakum Belediyesi birim listesi kapsamında hizmet veren müdürlük.";
  let address = "Mimarsinan Mah. İsmet İnönü Blv. No:114, 55200 Atakum/Samsun";

  const addrM = html.match(/<b>Adres:<\/b>\s*([^<]+)/i) || html.match(/Adres:\s*([^<\n]+)/i);
  if (addrM) address = addrM[1].replace(/\s+/g, " ").trim();

  const unitM = html.match(
    /class="unitAlldetails"[^>]*>([\s\S]*?)<div class="container mt-4">/i,
  );
  if (unitM) {
    const text = unitM[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 80) description = text.slice(0, 2000);
  } else {
    const descM = html.match(
      /Atakum Belediyesi[^<]{20,2000}?[.!?](?=\s*<|\s*###|Şube|$)/i,
    );
    if (descM) {
      const strip = descM[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (
        strip.length > 40 &&
        !/Tüm Hakları Saklıdır|Kişisel Veriler|Çerez/i.test(strip)
      ) {
        description = strip.slice(0, 2000);
      }
    }
  }

  const people = parsePeopleFromHtml(html);
  return { description, address, people };
}

async function fetchHtml(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "AtakumBel-SeederDataBot/1.0 (+dev)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.text();
}

async function main() {
  const bySlug = {};
  for (const slug of SLUGS) {
    const url = `https://atakum.bel.tr/birimDetay-${slug}`;
    process.stderr.write(`GET ${slug} ... `);
    try {
      const html = await fetchHtml(url);
      bySlug[slug] = parseDeptFromHtml(html);
      process.stderr.write(`ok (${bySlug[slug].people.length} kişi)\n`);
    } catch (e) {
      process.stderr.write(`FAIL ${e.message}\n`);
      bySlug[slug] = {
        description:
          "T.C. Atakum Belediyesi birim listesi kapsamında hizmet veren müdürlük.",
        address: "Mimarsinan Mah. İsmet İnönü Blv. No:114, 55200 Atakum/Samsun",
        people: [],
      };
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  const pairs = TITLE_NAMES.map((name, i) => ({ name, slug: SLUGS[i] })).sort((a, b) =>
    a.name.localeCompare(b.name, "tr"),
  );

  const departments = pairs.map((row, idx) => {
    const meta = bySlug[row.slug] || {};
    return {
      id: 1001 + idx,
      name: row.name,
      slug: row.slug,
      description: meta.description || "T.C. Atakum Belediyesi müdürlüğü.",
      address: meta.address || "Mimarsinan Mah. İsmet İnönü Blv. No:114, 55200 Atakum/Samsun",
      reports_to_president: false,
    };
  });

  const slugToDeptId = Object.fromEntries(departments.map((d) => [d.slug, d.id]));

  const websiteEmployees = [];
  let eid = 2001;
  for (const slug of SLUGS) {
    const deptId = slugToDeptId[slug];
    const peeps = (bySlug[slug] && bySlug[slug].people) || [];
    const slugKey = slug.replace(/[^a-z0-9]+/g, "-");
    for (const p of peeps) {
      const id = eid++;
      websiteEmployees.push({
        id,
        first_name: p.first_name,
        last_name: p.last_name,
        title: p.title,
        department_id: deptId,
        dahili_no: p.dahili_no,
        image_url: `/uploads/employees/birim-${slugKey}-${id}.jpg`,
        is_unit_manager: /müdür/i.test(p.title) && !/ofis|personel/i.test(p.title),
        is_contact_person: /ofis personeli/i.test(p.title),
        is_active: true,
      });
    }
  }

  const outPath = path.join(__dirname, "..", "seeders", "data", "atakumBirimGenerated.js");
  const body = `/* eslint-disable max-len */
/* Bu dosya scripts/build-atakum-birim-seed-data.cjs ile üretildi; kaynak: https://atakum.bel.tr birim detay sayfaları */
"use strict";

module.exports = {
  departments: ${JSON.stringify(departments, null, 2)},
  websiteEmployees: ${JSON.stringify(websiteEmployees, null, 2)},
};
`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, body, "utf8");
  console.log(
    "Wrote",
    outPath,
    "departments",
    departments.length,
    "employees",
    websiteEmployees.length,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
