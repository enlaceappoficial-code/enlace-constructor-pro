const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const needle = '}):null})()}' ;
const idx = s.indexOf(needle);
if (idx === -1) {
  console.log("OK: no se encontró patrón (no hubo cambios).");
  process.exit(0);
}

s = s.slice(0, idx) + '}):null})()' + s.slice(idx + needle.length);

if (s === s0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: brace extra removido.");
