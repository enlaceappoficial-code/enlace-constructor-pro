const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const lfStart =
  "function Lf(t,i,r){const{total:n}=Ee((t&&t.items)||[],r,t&&t.descuento,t&&t.modoCosteo);";
const dfAnchor =
  'function Df(t,i,r){const{total:n}=Ee(t.items||[],r,t.descuento,t.modoCosteo);';

const a = s.indexOf(lfStart);
const b = s.indexOf(dfAnchor);
if (a === -1) {
  console.log("No hay Lf insertado; no se aplica.");
  process.exit(0);
}
if (b === -1 || b < a) {
  throw new Error("No se encontró el ancla Df() para remover Lf() roto.");
}

s = s.slice(0, a) + s.slice(b);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_remove_broken_Lf_insertion_v1");

