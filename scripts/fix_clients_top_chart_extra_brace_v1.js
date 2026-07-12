const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const before =
  ']})]})]})]})}function vg({catalog:t,';
const after =
  ']})]})]})]})function vg({catalog:t,';

if (s.includes(after)) {
  console.log("OK: ya corregido.");
  process.exit(0);
}
if (!s.includes(before)) {
  console.log("OK: no se encontró patrón (no hubo cambios).");
  process.exit(0);
}

s = s.replace(before, after);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: llave extra removida.");

