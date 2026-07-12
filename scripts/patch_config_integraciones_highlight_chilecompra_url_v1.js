const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

replaceOnce(
  "https://www.chilecompra.cl/api/ (llega al correo registrado)",
  "https://www.chilecompra.cl/api/ (ÚNICO sitio) (llega al correo registrado)"
);

replaceOnce(
  "https://www.chilecompra.cl/api/ y solicita tu ticket API.",
  "https://www.chilecompra.cl/api/ (ÚNICO sitio) y solicita tu ticket API."
);

replaceOnce(
  "https://www.chilecompra.cl/api/.",
  "https://www.chilecompra.cl/api/ (ÚNICO sitio)."
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: URL ChileCompra resaltada (${changed} cambios).`);
