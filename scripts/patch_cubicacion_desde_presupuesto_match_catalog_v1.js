const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from = "for(const Z of x.items){var O=r&&r.find(X=>X.desc===Z.desc||X.id===Z._cid);if(O){";
const to =
  'for(const Z of x.items){var O=null;Z._cid&&(O=r&&r.find(X=>X.id===parseInt(Z._cid))||null),O||(O=r&&r.find(X=>X.desc===Z.desc)||null);if(!O){var Ue=String(Z.desc||"").toLowerCase(),$e=null;for(const X of r||[]){var ee=String(X.desc||"").toLowerCase();if(Ue.includes(ee)||ee.includes(Ue)){$e=X;break}}O=$e}if(O){';

if (!s.includes(from)) throw new Error("No se encontró el patrón esperado para match catálogo en ig().");
s = s.replace(from, to);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_desde_presupuesto_match_catalog_v1");

