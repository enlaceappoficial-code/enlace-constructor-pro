const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

const re =
  /children:\["ID","Nombre","Contacto","Email","[^"]+","Presup\.","Deuda","Estado",""\]\.map\(I=>e\.jsx\("th",\{style:c\.th,children:I\},I\)\)/;

if (!re.test(s0)) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

const replacement =
  'children:[["ID","id"],["Nombre","nombre"],["Contacto","contacto"],["Email","email"],["Teléfono","telefono"],["Presup.","presup"],["Deuda","deuda"],["Estado","estado"],["",""]].map(([I,D])=>e.jsx("th",{style:u(d({},c.th),D?{cursor:"pointer",userSelect:"none"}:{}),onClick:D?()=>{setSort(k=>k.k===D?u(d({},k),{d:-k.d}):{k:D,d:1}),setPage(1)}:void 0,children:e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[I,D&&sort.k===D?e.jsx("span",{style:{opacity:.7,fontSize:11},children:sort.d===1?"▲":"▼"}):null]})},I))';

const s = s0.replace(re, replacement);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: sort headers aplicado (regex).");

