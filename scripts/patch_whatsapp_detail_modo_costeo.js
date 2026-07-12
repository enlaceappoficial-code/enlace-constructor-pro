const fs = require("fs");

const filePath =
  "d:/Enlace Mundo/enlace constructor/Proyecto Tauri/enlace-tauri/src/assets/index.js";

const src = fs.readFileSync(filePath, "utf8");

const startNeedle =
  'D=t.items.filter(S=>S.desc).map(S=>{var O=(parseFloat(S.cant)||0)*(parseFloat(S.precio)||0);return';
const start = src.indexOf(startNeedle);
if (start < 0) {
  throw new Error("No se encontró el bloque D=... del WhatsApp (detalle de partidas).");
}

const end = src.indexOf(",k=[", start);
if (end < 0) {
  throw new Error("No se encontró el final del bloque D=... (esperaba ,k=[ después).");
}

const replacement =
  'D=(t.items||[]).filter(S=>S.desc).map(S=>{var O=parseFloat(S.cant)||0,U=parseFloat(S.precio)||0,$=O*U,ee=S._tipoCosto||(S._cid?\"auto\":\"mo\"),le=0,Z=0;if(ee===\"mat\")le=$;else if(ee===\"mo\")Z=$;else{var X=parseFloat(S._apuMatUnit)||0;le=Math.max(0,Math.min($,X*O)),Z=Math.max(0,$-le)}var W=t.modoCosteo||\"completo\";if(W===\"mo\"){var T=O?Z/O:0;return`• ${S.desc} — P.Unit(MO): ${ne(T)} | Total(MO): ${ne(Z)}`}return W===\"separado\"?`• ${S.desc} — MO: ${ne(Z)} | MAT: ${ne(le)} | Total: ${ne($)}`:`• ${S.desc} — ${ne($)}`}).join(`\n`)';

if (src.slice(start, end).startsWith(replacement)) {
  console.log("OK: el WhatsApp ya estaba ajustado a modoCosteo");
  process.exit(0);
}

const outPath = filePath + ".bak_whatsapp_detail_modo_costeo";
fs.copyFileSync(filePath, outPath);

const out = src.slice(0, start) + replacement + src.slice(end);
fs.writeFileSync(filePath, out, "utf8");

console.log("OK: parche aplicado. Backup:", outPath);

