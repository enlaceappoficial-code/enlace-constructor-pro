const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const find =
  'title:y.__apuTitle||"",onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n┬┐Filtrar por la primera APU?")){var S=A.split(",")[0].trim();S&&w(("apu:"+S).trim())}}else r("Sin APU")},children:y.__apuShort||"ÔÇö"})';
const repl = 'title:y.__apuTitle||"",children:y.__apuShort||"ÔÇö"})';

if (!s.includes(find)) {
  console.log("OK: no se encontró click en celda APUs.");
  process.exit(0);
}

s = s.split(find).join(repl);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: click en celda APUs eliminado.");

