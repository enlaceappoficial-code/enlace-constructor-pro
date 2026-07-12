const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const bad = 'g=m.map(w=>\'<td style="text-align:right;font-weight:700">\'+C(b[w.rol])+"</td>\').join("")';
const good = 'g=m.map(w=>\'<td style="text-align:right;font-weight:700">\'+C(b[w.rol])+"</td>").join("")';

if (!s.includes(bad)) {
  if (s.includes(good)) {
    console.log("SKIP fix_resumen_dotacion_quote_v3 (ya corregido)");
    process.exit(0);
  }
  throw new Error("No se encontró el patrón de comillas incorrectas en Resumen de Dotación.");
}

s = s.replace(bad, good);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_resumen_dotacion_quote_v3");

