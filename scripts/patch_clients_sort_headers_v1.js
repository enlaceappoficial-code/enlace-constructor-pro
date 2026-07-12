const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

replaceOnce(
  'children:["ID","Nombre","Contacto","Email","Tel├®fono","Presup.","Deuda","Estado",""].map(I=>e.jsx("th",{style:c.th,children:I},I))',
  'children:[["ID","id"],["Nombre","nombre"],["Contacto","contacto"],["Email","email"],["Teléfono","telefono"],["Presup.","presup"],["Deuda","deuda"],["Estado","estado"],["",""]].map(([I,D])=>e.jsx("th",{style:u(d({},c.th),D?{cursor:"pointer",userSelect:"none"}:{}),onClick:D?()=>{setSort(k=>k.k===D?u(d({},k),{d:-k.d}):{k:D,d:1}),setPage(1)}:void 0,children:e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[I,D&&sort.k===D?e.jsx("span",{style:{opacity:.7,fontSize:11},children:sort.d===1?"▲":"▼"}):null]})},I))'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: sort headers aplicado (${changed} cambios).`);

