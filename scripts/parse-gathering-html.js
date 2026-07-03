"use strict";
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
  path.join(__dirname, "gathering-source.html"),
  "utf8",
);

const rows = html.match(/<tr class="netdatarow">[\s\S]*?<\/tr>/g) || [];
const areas = [];

for (const row of rows) {
  const destMatch = row.match(/destination=([\d.]+)%2C([\d.]+)/);
  if (!destMatch) continue;

  const nameMatch = row.match(
    /background-color:#FFFF99[\s\S]*?class="viewercont">([^<]+)<\/div>/,
  );
  if (!nameMatch) continue;

  areas.push({
    name: nameMatch[1].trim(),
    latitude: parseFloat(destMatch[1]),
    longitude: parseFloat(destMatch[2]),
  });
}

if (process.argv.includes("--write")) {
  const outPath = path.join(__dirname, "..", "seeders", "data", "atakumGatheringAreas.js");
  const content =
    `"use strict";\n\n` +
    `/**\n` +
    ` * Atakum Belediyesi acil durum toplanma alanlari (AFAD / KEOS).\n` +
    ` * Kaynak: keos.atakum.bel.tr — geoafad.afad_toplanma_point\n` +
    ` */\n` +
    `module.exports.ATAKUM_GATHERING_AREAS = ${JSON.stringify(areas, null, 2)};\n`;
  fs.writeFileSync(outPath, content);
  console.error(`Wrote ${areas.length} areas to ${outPath}`);
} else {
  console.log(JSON.stringify(areas, null, 2));
  console.error("Total:", areas.length);
}
