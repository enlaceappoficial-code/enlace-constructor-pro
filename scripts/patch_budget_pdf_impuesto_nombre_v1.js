const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  '[[\"Subtotal Neto\",s(m)],[\"IVA (\"+Math.round(r.iva*100)+\"%)\",s(p)]';
const to =
  '[[t.modoCosteo===\"mo\"?\"Subtotal Mano de Obra\":\"Subtotal Neto\",s(m)],[((r&&r.impuestoNombre||r&&r.moneda&&r.moneda.nombreImp||\"IVA\")+\" (\"+Math.round(((r&&r.iva)||.19)*100)+\"%)\"),s(p)]';

if (!s.includes(from)) throw new Error("No se encontró el bloque de totales del PDF Presupuesto (needle exacto).");
s = s.replace(from, to);

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_budget_pdf_impuesto_nombre_v1");

