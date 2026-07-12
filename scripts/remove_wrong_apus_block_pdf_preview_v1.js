const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

function replaceBlock(start, endMarker, replacement) {
  const a = s.indexOf(start);
  if (a === -1) return false;
  const b = s.indexOf(endMarker, a);
  if (b === -1) return false;
  s = s.slice(0, a) + replacement + s.slice(b + endMarker.length);
  return true;
}

const start =
  ',g!==null&&(()=>{var A=[];try{A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")||"[]")||[]}catch(E){}var S=[];try{S=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales")||"[]")||[]}catch(E){}var O={};';
const endMarker = '})})(),e.jsxs("div",{style:{display:"flex",gap:8},children:[';
const replacement = ',e.jsxs("div",{style:{display:"flex",gap:8},children:[';

const ok = replaceBlock(start, endMarker, replacement);
if (!ok) {
  console.log("OK: no se encontró el bloque a remover.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: bloque incorrecto 'APUs vinculadas' removido de Vista Previa.");

