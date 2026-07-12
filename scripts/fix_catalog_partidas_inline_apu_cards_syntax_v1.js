const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const bad =
  'rows.length?e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12},children:[e.jsx("div",{style:{color:a.muted},children:"Items: "+rows.length}),e.jsx("div",{style:{color:a.muted},children:""}})}):null';
const good =
  'rows.length?e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12},children:[e.jsx("div",{style:{color:a.muted},children:"Items: "+rows.length})]}):null';

if (!s.includes(bad)) {
  console.log("OK: no se encontró el patrón a corregir.");
  process.exit(0);
}

s = s.split(bad).join(good);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: sintaxis fichas APU corregida.");

