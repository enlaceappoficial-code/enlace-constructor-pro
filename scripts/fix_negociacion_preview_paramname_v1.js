const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

let changed = false;

const sigFrom = "function Df(t,i,r,l){";
const sigTo = "function Df(t,i,r,u){";
if (s.includes(sigFrom)) {
  s = s.replace(sigFrom, sigTo);
  changed = true;
}

const ifFrom = ';if(l==="return")return F;var g=window.open';
const ifTo = ';if(u==="return")return F;var g=window.open';
if (s.includes(ifFrom)) {
  s = s.replace(ifFrom, ifTo);
  changed = true;
}

if (!changed) {
  throw new Error("No se encontraron patrones para corregir (Df preview param).");
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_negociacion_preview_paramname_v1");

