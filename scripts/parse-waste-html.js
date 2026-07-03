"use strict";
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.join(__dirname, "waste-source.html"),
  "utf8",
);

function formatMahalle(mahalle) {
  const lower = mahalle.trim().toLocaleLowerCase("tr-TR");
  return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
}

function buildName(konteynerAdi, mahalle, seqInMahalle) {
  const label = formatMahalle(mahalle);
  const raw = (konteynerAdi || "").trim();
  if (raw && raw !== "1" && !/^\d+$/.test(raw)) {
    return `${label} - ${raw}`;
  }
  return `${label} Atık Noktası ${seqInMahalle}`;
}

const rows = html.match(/<tr class="netdatarow">[\s\S]*?<\/tr>/g) || [];
const points = [];
const mahalleCounts = {};

for (const row of rows) {
  const destMatch = row.match(/destination=([\d.]+)%2C([\d.]+)/);
  if (!destMatch) continue;

  const konteynerMatch = row.match(
    /lbldisplay">Konteyner Adı<\/div><div class="viewercont">([^<]*)<\/div>/,
  );
  const mahalleMatch = row.match(
    /lbldisplay">Mahalle Adı<\/div><div class="viewercont">([^<]*)<\/div>/,
  );
  if (!mahalleMatch) continue;

  const mahalle = mahalleMatch[1].trim();
  mahalleCounts[mahalle] = (mahalleCounts[mahalle] || 0) + 1;
  const konteynerAdi = konteynerMatch ? konteynerMatch[1] : "";

  points.push({
    name: buildName(konteynerAdi, mahalle, mahalleCounts[mahalle]),
    latitude: parseFloat(destMatch[1]),
    longitude: parseFloat(destMatch[2]),
  });
}

if (process.argv.includes("--write")) {
  const outPath = path.join(__dirname, "..", "seeders", "data", "atakumWastePoints.js");
  const content =
    `"use strict";\n\n` +
    `/**\n` +
    ` * Atakum Belediyesi atik toplama konteyner noktalari (KEOS).\n` +
    ` * Kaynak: keos.atakum.bel.tr — geocop_konteyner\n` +
    ` */\n` +
    `module.exports.ATAKUM_WASTE_POINTS = ${JSON.stringify(points, null, 2)};\n`;
  fs.writeFileSync(outPath, content);
  console.error(`Wrote ${points.length} waste points to ${outPath}`);
} else {
  console.log(JSON.stringify(points, null, 2));
  console.error("Total:", points.length);
}
