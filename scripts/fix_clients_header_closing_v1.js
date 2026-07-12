const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const bad =
  ']})]}])}),]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';
const good =
  ']})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 280px",gap:16},children:[';

if (s.includes(good)) {
  console.log("OK: ya corregido.");
  process.exit(0);
}
if (!s.includes(bad)) {
  console.log("OK: no se encontró patrón (no hubo cambios).");
  process.exit(0);
}

s = s.replace(bad, good);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: cierre header clientes corregido.");

