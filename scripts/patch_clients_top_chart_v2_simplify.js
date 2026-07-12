const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const startMarker =
  '}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16},children:[';
const endMarker =
  'e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';

const start = s.indexOf(startMarker);
if (start === -1) {
  console.log("OK: no se encontró bloque v1 (no hubo cambios).");
  process.exit(0);
}
const end = s.indexOf(endMarker, start + startMarker.length);
if (end === -1) {
  console.log("ERROR: no se encontró fin de bloque.");
  process.exit(2);
}

const replacement =
  '}),e.jsxs("div",{style:c.card,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:c.ct,children:"Top Clientes por Monto"}),e.jsx("span",{style:{fontSize:11,color:a.muted,opacity:.7},children:"(Inicio)"})]}),e.jsx(Lp,{budgets:r,clients:t,cfg:n})]}),';

s = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: bloque clientes simplificado (v2).");

