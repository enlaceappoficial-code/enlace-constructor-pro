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

// Header: alinear columnas con el botón de dimensiones y dar más espacio a precio unitario.
replaceOnce(
  'gridTemplateColumns:"1fr 55px 72px 100px 100px 60px 28px"',
  'gridTemplateColumns:"1fr 55px 28px 72px 170px 100px 60px 28px"',
  "gridTemplateColumns header ítems"
);

// Header labels + no-print index: insertar columna vacía y renombrar "Precio"
replaceRegexOnce(
  /children:\["[^"]*","Cant\.","Unidad","Precio","Total","HH",""\]\.map\(\(W,T\)=>e\.jsx\("div",\{className:T===5\?"no-print":""/,
  'children:["Descripci├│n","Cant.","","Unidad","Costo / P.Unit","Total","HH",""].map((W,T)=>e.jsx("div",{className:T===6?"no-print":""',
  "labels header ítems"
);

// Filas: mismo ancho para que el input de precio unitario se vea y sea editable.
replaceOnce(
  'gridTemplateColumns:"1fr 55px 28px 72px 100px 100px 60px 28px"',
  'gridTemplateColumns:"1fr 55px 28px 72px 170px 100px 60px 28px"',
  "gridTemplateColumns filas ítems"
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_budget_editor_show_unit_price_regex");

