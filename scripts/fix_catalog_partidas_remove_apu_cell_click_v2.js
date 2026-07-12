const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const start =
  'title:y.__apuTitle||"",onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n';
const end = '},children:y.__apuShort||"ÔÇö"}),e.jsx';
const repl = 'title:y.__apuTitle||"",children:y.__apuShort||"ÔÇö"}),e.jsx';

const a = s.indexOf(start);
if (a === -1) {
  console.log("OK: no se encontró el inicio del click en celda APUs.");
  process.exit(0);
}
const b = s.indexOf(end, a);
if (b === -1) {
  console.log("ERROR: encontrado inicio pero no fin del bloque.");
  process.exit(2);
}

s = s.slice(0, a) + repl + s.slice(b + end.length);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: click en celda APUs eliminado (v2).");
