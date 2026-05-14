/**
 * Fixes Turkish strings where UTF-8 was misinterpreted as Windows-1252 (mojibake).
 * Merges CP1252 mojibake pairs back to UTF-8 when the byte pair is a valid UTF-8
 * 2-byte sequence (lead C2-DF). Leaves already-correct Turkish text unchanged.
 */
const fs = require("fs");
const path = require("path");

const unicodeToByte = new Map();
for (let byte = 0; byte < 256; byte++) {
  const utf8OfByteAsLatin = Buffer.from([byte]).toString("latin1");
  unicodeToByte.set(utf8OfByteAsLatin, byte);
}

const cp1252Special = {
  0x80: "\u20AC",
  0x82: "\u201A",
  0x83: "\u0192",
  0x84: "\u201E",
  0x85: "\u2026",
  0x86: "\u2020",
  0x87: "\u2021",
  0x88: "\u02C6",
  0x89: "\u2030",
  0x8a: "\u0160",
  0x8b: "\u2039",
  0x8c: "\u0152",
  0x8e: "\u017D",
  0x91: "\u2018",
  0x92: "\u2019",
  0x93: "\u201C",
  0x94: "\u201D",
  0x95: "\u2022",
  0x96: "\u2013",
  0x97: "\u2014",
  0x98: "\u02DC",
  0x99: "\u2122",
  0x9a: "\u0161",
  0x9b: "\u203A",
  0x9c: "\u0153",
  0x9e: "\u017E",
  0x9f: "\u0178",
};
for (const [hex, ch] of Object.entries(cp1252Special)) {
  unicodeToByte.set(ch, Number(hex));
}

function utf8TwoByteLead(b) {
  return b >= 0xc2 && b <= 0xdf;
}

function decodeMojibakePreserveUnicode(str) {
  const bytes = [];
  let i = 0;
  while (i < str.length) {
    const ch = str[i];
    const cp = ch.codePointAt(0);
    if (cp < 0x80) {
      bytes.push(cp);
      i++;
      continue;
    }
    const next = i + 1 < str.length ? str[i + 1] : null;
    const b1 = unicodeToByte.get(ch);
    const b2 = next != null ? unicodeToByte.get(next) : undefined;
    if (
      next != null &&
      b1 !== undefined &&
      b2 !== undefined &&
      utf8TwoByteLead(b1)
    ) {
      const chunk = Buffer.from([b1, b2]);
      const decoded = chunk.toString("utf8");
      if (decoded.length === 1 && decoded.charCodeAt(0) !== 0xfffd) {
        bytes.push(b1, b2);
        i += 2;
        continue;
      }
    }
    bytes.push(...Buffer.from(ch, "utf8"));
    i++;
  }
  return Buffer.from(bytes).toString("utf8");
}

function resolveInputs(roots) {
  const out = [];
  for (const r of roots) {
    const abs = path.resolve(r);
    if (!fs.existsSync(abs)) continue;
    const st = fs.statSync(abs);
    if (st.isDirectory()) out.push(...collectJs(abs));
    else if (abs.endsWith(".js")) out.push(abs);
  }
  return out;
}

function main() {
  const roots = process.argv.slice(2);
  const files =
    roots.length > 0
      ? resolveInputs(roots)
      : resolveInputs([
          path.join(__dirname, "../controllers"),
          path.join(__dirname, "../routes"),
          path.join(__dirname, "../middleware"),
          path.join(__dirname, "../helpers"),
        ]);

  for (const file of files) {
    const abs = path.resolve(file);
    if (!abs.endsWith(".js")) continue;
    const raw = fs.readFileSync(abs, "utf8");
    const fixed = decodeMojibakePreserveUnicode(raw);
    if (fixed !== raw) {
      fs.writeFileSync(abs, fixed, "utf8");
      console.error("fixed:", abs);
    }
  }
}

function collectJs(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...collectJs(p));
    else if (name.endsWith(".js")) out.push(p);
  }
  return out;
}

if (require.main === module) {
  main();
}

module.exports = { decodeMojibakePreserveUnicode };
