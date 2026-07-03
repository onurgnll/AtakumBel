"use strict";
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "wifi-source.html"), "utf8");

const blockMatch = html.match(/var locations\s*=\s*\[([\s\S]*?)\];/);
if (!blockMatch) {
  console.error("locations array not found in wifi-source.html");
  process.exit(1);
}

const entryRe =
  /\{\s*lat:\s*([\d.]+),\s*lng:\s*([\d.]+),\s*title:\s*"([^"]+)",\s*type:\s*"([^"]+)"\s*\}/g;

const points = [];
let match;
while ((match = entryRe.exec(blockMatch[1])) !== null) {
  const [, lat, lng, title, type] = match;
  if (type !== "nowActive") continue;

  const name = title
    .replace(/\s*Ücretsiz WiFi Noktas[ıi]\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  points.push({
    name,
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  });
}

if (process.argv.includes("--write")) {
  const outPath = path.join(
    __dirname,
    "..",
    "seeders",
    "data",
    "atakumFreeWifiPoints.js",
  );
  const content =
    `"use strict";\n\n` +
    `/**\n` +
    ` * Atakum Belediyesi ucretsiz WiFi noktalari.\n` +
    ` * Kaynak: wifi.atakum.bel.tr\n` +
    ` */\n` +
    `module.exports.ATAKUM_FREE_WIFI_POINTS = ${JSON.stringify(points, null, 2)};\n`;
  fs.writeFileSync(outPath, content);
  console.error(`Wrote ${points.length} WiFi points to ${outPath}`);
} else {
  console.log(JSON.stringify(points, null, 2));
  console.error("Total:", points.length);
}
