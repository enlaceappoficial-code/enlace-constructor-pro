const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function mustReplace(label, needle, replacement) {
  if (s.includes(replacement)) return;
  const idx = s.indexOf(needle);
  if (idx === -1) {
    console.error(`ERROR: no se encontró el patrón (${label}).`);
    process.exit(2);
  }
  s = s.replace(needle, replacement);
  changed++;
}

// 1) Hacer el root de Documentos de Obra un layout vertical con alto fijo (evita scroll que hace parecer "pantalla completa")
mustReplace(
  "vg-root-flex",
  'x=B.find(f=>f.id===p);return e.jsxs("div",{children:[e.jsx("div",{style:u(d({},c.card),{marginBottom:14}),children:',
  'x=B.find(f=>f.id===p);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 92px)",overflow:"hidden"},children:[e.jsx("div",{style:u(d({},c.card),{marginBottom:14}),children:'
);

// 2) Hacer que el bloque inferior (cards + preview) tome el espacio restante (flex:1) en vez de altura calculada rígida
mustReplace(
  "vg-body-flex1",
  'j&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 210px)",overflow:"hidden"},children:[',
  'j&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0,overflow:"hidden"},children:['
);

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: Documentos de Obra ahora mantiene módulos visibles arriba y el Informe queda confinado al recuadro inferior con scroll interno.");

