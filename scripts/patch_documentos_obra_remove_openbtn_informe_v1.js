const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

const needle =
  'b!=="locked"&&e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[p==="negociacion"';
const replacement =
  'b!=="locked"&&p!=="informe"&&e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[p==="negociacion"';

if (s0.includes(replacement)) {
  console.log("OK: ya estaba aplicado.");
  process.exit(0);
}

if (!s0.includes(needle)) {
  console.error("ERROR: no se encontró el bloque esperado para parchear.");
  process.exit(2);
}

const s1 = s0.replace(needle, replacement);
fs.writeFileSync(filePath, s1, "utf8");
console.log("OK: botón superior 'Abrir / Imprimir PDF' oculto para Informe.");

