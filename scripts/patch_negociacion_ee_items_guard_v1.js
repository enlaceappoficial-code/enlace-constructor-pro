const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from = "function Df(t,i,r){const{total:n}=Ee(t.items,r,t.descuento,t.modoCosteo);";
const to = "function Df(t,i,r){const{total:n}=Ee(t.items||[],r,t.descuento,t.modoCosteo);";

if (!s.includes(from)) {
  throw new Error("No se encontró el inicio esperado de Df() (Hoja de Negociación).");
}
s = s.replace(from, to);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_negociacion_ee_items_guard_v1");

