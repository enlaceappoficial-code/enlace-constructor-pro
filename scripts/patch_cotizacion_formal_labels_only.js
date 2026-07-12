const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

function mustReplace(needle, replacement) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró patrón: ${needle.slice(0, 80)}...`);
  s = s.replace(needle, replacement);
}

mustReplace(
  'f.text("Trabajos · Solo mano de obra — materiales por mandante",A,S+12)',
  'f.text(t.modoCosteo==="mo"?"Trabajos · Solo mano de obra — materiales por mandante":t.modoCosteo==="separado"?"Trabajos · Mano de obra + materiales (desglosado)":"Trabajos · Mano de obra + materiales",A,S+12)'
);

mustReplace(
  '["IVA (19%)",I(z)]',
  '[(r&&r.impuestoNombre||r&&r.moneda&&r.moneda.nombreImp||"IVA")+" ("+Math.round(((r&&r.iva)||.19)*100)+"%)",I(z)]'
);

mustReplace(
  'var Y=["— Valores netos, no incluyen IVA (19%).","— Materiales de cargo exclusivo del mandante.","— Precios unitarios fijos e independientes del volumen total.","— Forma de pago a convenir según estados de pago de obra.","— Validez: "+b+" días desde la fecha de emisión."];',
  'var Y=["— Valores netos, no incluyen "+(r&&r.impuestoNombre||r&&r.moneda&&r.moneda.nombreImp||"IVA")+" ("+Math.round(((r&&r.iva)||.19)*100)+"%).",t.modoCosteo==="mo"?"— Materiales de cargo exclusivo del mandante.":t.modoCosteo==="separado"?"— Mano de obra y materiales desglosados (MO/MAT).":"— Incluye mano de obra y materiales.","— Precios unitarios fijos e independientes del volumen total.","— Forma de pago a convenir según estados de pago de obra.","— Validez: "+b+" días desde la fecha de emisión."];'
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cotizacion_formal_labels_only");

