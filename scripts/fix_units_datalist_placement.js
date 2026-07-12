const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceOnce(needle, replacement, label) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró: ${label}`);
  const at2 = s.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`No-único: ${label}`);
  s = s.slice(0, at) + replacement + s.slice(at + needle.length);
}

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
  /,e\.jsx\("datalist",\{id:"unitList",children:\[[\s\S]*?\]\}\)/,
  "",
  "quitar datalist fuera de editor"
);

replaceOnce(
  '}),(I.items||[]).map',
  `}),${datalist},(I.items||[]).map`,
  "insertar datalist en editor"
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_units_datalist_placement");

