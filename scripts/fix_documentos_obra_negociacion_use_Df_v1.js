const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const callFrom = 'f.id==="negociacion"?h(Lf(j,F,r)):';
const callTo = 'f.id==="negociacion"?(Df(j,F,r),h("")):';

if (!s.includes(callFrom)) {
  throw new Error("No se encontró el llamado Lf() en Documentos de Obra.");
}
s = s.replace(callFrom, callTo);

const dfFrom =
  'function Df(t,i,r){const{total:n}=Ee(t.items||[],r,t.descuento,t.modoCosteo);';
const dfTo =
  'function Df(t,i,r){if(!t)return;const{total:n}=Ee(t.items||[],r,t.descuento,t.modoCosteo);';

if (!s.includes(dfFrom) && !s.includes(dfTo)) {
  throw new Error("No se encontró el inicio esperado de Df() para agregar guard.");
}
if (s.includes(dfFrom)) s = s.replace(dfFrom, dfTo);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_documentos_obra_negociacion_use_Df_v1");

