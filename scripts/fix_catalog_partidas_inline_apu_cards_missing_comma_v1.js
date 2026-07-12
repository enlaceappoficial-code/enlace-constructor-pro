const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const find = ']})e.jsxs("div",{style:{display:"flex",gap:8},children:[';
const repl = ']}),e.jsxs("div",{style:{display:"flex",gap:8},children:[';

if (!s.includes(find)) {
  console.log("OK: no se encontró el patrón de coma faltante.");
  process.exit(0);
}

s = s.split(find).join(repl);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: coma insertada en detalle Partida.");

