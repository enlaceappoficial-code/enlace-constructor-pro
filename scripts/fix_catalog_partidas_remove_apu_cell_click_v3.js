const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const start =
  ',onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n';
const end = '}}else r("Sin APU")}';

const a = s.indexOf(start);
if (a === -1) {
  console.log("OK: no se encontró onClick en celda APUs (v3).");
  process.exit(0);
}
const b = s.indexOf(end, a);
if (b === -1) {
  console.log("ERROR: encontrado inicio pero no fin onClick (v3).");
  process.exit(2);
}

s = s.slice(0, a) + s.slice(b + end.length);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: onClick eliminado en celda APUs (v3).");

