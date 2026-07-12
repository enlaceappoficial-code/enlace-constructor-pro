const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceOnce(needle, replacement, label) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró: ${label}`);
  const at2 = s.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`No-único: ${label}`);
  s = s.slice(0, at) + replacement + s.slice(at + needle.length);
}

// Fix: en modo "Solo MO", el cursor vertical G no se incrementa dentro del branch `if(ie==="mo")`,
// lo que hace que todas las filas se dibujen en la misma Y y sólo se vea la última.
const FROM =
  'if(ie==="mo"){var Br=hr?Sr/hr:0;o.text(s(Br),170,G+5.3,{align:"right"}),o.setFont("helvetica","bold"),o.setTextColor(...F),o.text(s(Sr),194,G+5.3,{align:"right"})}';

const TO =
  'if(ie==="mo"){var Br=hr?Sr/hr:0;o.text(s(Br),170,G+5.3,{align:"right"}),o.setFont("helvetica","bold"),o.setTextColor(...F),o.text(s(Sr),194,G+5.3,{align:"right"}),G+=Fr,G>262&&(o.addPage(),G=18)}';

replaceOnce(FROM, TO, "incremento Y filas MO en PDF");

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_pdf_mo_items_overlap");

