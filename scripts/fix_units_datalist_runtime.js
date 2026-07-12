const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceRegexOnce(re, replacement, label) {
  const m = s.match(re);
  if (!m) throw new Error(`No se encontró: ${label}`);
  const m2 = s.slice(m.index + 1).match(re);
  if (m2) throw new Error(`No-único: ${label}`);
  s = s.replace(re, replacement);
}

const unitOptions = [
  "unidad",
  "m",
  "m²",
  "m2",
  "m³",
  "m3",
  "ml",
  "kg",
  "g",
  "lt",
  "l",
  "h",
  "día",
  "semana",
  "mes",
  "%",
];

const datalist =
  'e.jsx("datalist",{id:"unitList",children:[' +
  unitOptions.map((v) => `e.jsx("option",{value:${JSON.stringify(v)}},${JSON.stringify(v)})`).join(
    ","
  ) +
  "]})";

replaceRegexOnce(
  /\}\)\}\),e\.jsx\("datalist",\{id:"unitList",children:\[[\s\S]*?\]\}\)\(\),e\.jsx\("button"/,
  `})})(),e.jsx("button"`,
  "quitar datalist de fila y restaurar IIFE"
);

replaceRegexOnce(
  /e\.jsx\("div",\{style:\{display:"grid",gridTemplateColumns:"1fr 55px 28px 72px 170px 100px 60px 28px",gap:6,marginBottom:4\},children:\[[\s\S]*?\]\.map\(\(W,T\)=>e\.jsx\("div",\{className:T===6\?"no-print":""[\s\S]*?\}\)\)\}\)\)/,
  (m) => `${m},${datalist}`,
  "insertar datalist unitList en header"
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_units_datalist_runtime");

