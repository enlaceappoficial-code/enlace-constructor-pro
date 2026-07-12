const fs = require("fs");

const filePath =
  "d:/Enlace Mundo/enlace constructor/Proyecto Tauri/enlace-tauri/src/assets/index.js";

const src = fs.readFileSync(filePath, "utf8");

const from = "w=(M,q)=>{var J=120;return M+=8,";
const to = 'w=(M,q)=>{var J=120;return M+=(t.modoCosteo==="mo"?14:8),';

if (src.includes(to)) {
  console.log("OK: el ajuste de offset de totales (Solo MO) ya estaba aplicado");
  process.exit(0);
}

const idx = src.indexOf(from);
if (idx < 0) {
  throw new Error("No se encontró el bloque de totales w=(M,q)=>{...} para parchear");
}

const outPath = filePath + ".bak_pdf_totals_offset_mo";
fs.copyFileSync(filePath, outPath);
fs.writeFileSync(filePath, src.replace(from, to), "utf8");

console.log("OK: parche aplicado. Backup:", outPath);

