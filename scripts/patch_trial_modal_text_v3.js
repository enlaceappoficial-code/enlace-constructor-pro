const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function applyRegex(re, replacement) {
  const next = s.replace(re, replacement);
  if (next !== s) {
    s = next;
    changed++;
    return true;
  }
  return false;
}

applyRegex(
  /children:\"Esta versi[^\"]*\"/,
  'children:"Tu prueba gratuita de 10 dias ha finalizado."'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: texto modal trial (v3) (${changed} cambios).`);
