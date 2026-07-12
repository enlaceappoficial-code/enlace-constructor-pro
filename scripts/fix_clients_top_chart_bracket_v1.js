const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const before =
  ')]})]}]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';
const after =
  ')]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';

if (s.includes(after)) {
  console.log("OK: ya corregido.");
  process.exit(0);
}
if (!s.includes(before)) {
  console.log("OK: no se encontró patrón (no hubo cambios).");
  process.exit(0);
}

s = s.replace(before, after);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: bracket extra removido.");

