const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

let changed = false;

// 1) Permite que Df retorne HTML (sin abrir ventana) cuando se llama con l==="return"
const sigFrom = "function Df(t,i,r){if(!t)return;";
const sigTo = "function Df(t,i,r,l){if(!t)return;";
if (s.includes(sigFrom)) {
  s = s.replace(sigFrom, sigTo);
  changed = true;
}

const openNeedle = ',g=window.open("","_blank");g.document.write(F),g.document.close()';
const openPatch =
  ';if(l==="return")return F;var g=window.open("","_blank");g.document.write(F),g.document.close()';
if (s.includes(openNeedle)) {
  s = s.replace(openNeedle, openPatch);
  changed = true;
}

// 2) En Documentos de Obra, Hoja de Negociación debe renderizarse en vista previa (abajo) como los demás
const callFrom = 'f.id==="negociacion"?(Df(j,F,r),h("")):';
const callTo = 'f.id==="negociacion"?h(Df(j,F,r,"return")):';
if (s.includes(callFrom)) {
  s = s.replace(callFrom, callTo);
  changed = true;
}

if (!changed) {
  console.log("No se encontraron patrones; no se aplica.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_negociacion_preview_in_modal_v1");

