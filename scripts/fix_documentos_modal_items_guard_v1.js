const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const reps = [
  [
    "const{total:h}=Ee(t.items,r,t.descuento,t.modoCosteo);",
    "const{total:h}=Ee(t.items||[],r,t.descuento,t.modoCosteo);",
  ],
  [
    "const{sub:K,iva:y,total:P,anticipo:A}=Ee(t.items,r,t.descuento,t.modoCosteo);",
    "const{sub:K,iva:y,total:P,anticipo:A}=Ee(t.items||[],r,t.descuento,t.modoCosteo);",
  ],
  ["t.items.forEach(", "(t.items||[]).forEach("],
];

let changed = false;
for (const [from, to] of reps) {
  if (s.includes(from)) {
    s = s.replace(from, to);
    changed = true;
  }
}

if (!changed) {
  console.log("No se encontraron patrones; no se aplica.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_documentos_modal_items_guard_v1");

