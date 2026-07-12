const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

const terms = [
  "presupuesto_nuevo",
  "Visita a terreno",
  "manual_",
  'value:"seguimiento"',
  "Reunión",
  "Otros",
  "cotizacion",
  "compra_materiales",
  "subcontrato",
  "postventa",
  "ecpNoteDate",
  "Agregar nota…",
  "$g",
  "function Of(",
  "function $g",
  "$g=function",
  "var $g",
];

for (const t of terms) console.log(`${t}:`, s.includes(t));

const rx = /\$g/g;
const hits = [];
let m;
while ((m = rx.exec(s))) hits.push(m.index);
console.log("$g hits:", hits.length);
console.log("first hits:", hits.slice(0, 10));
if (hits[0] != null) console.log("context:", s.slice(Math.max(0, hits[0] - 80), hits[0] + 180));
console.log("len:", s.length);
