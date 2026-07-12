const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const s0 = s;

function replaceOnce(needle, replacement, label) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró: ${label}`);
  const at2 = s.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`No-único: ${label}`);
  s = s.slice(0, at) + replacement + s.slice(at + needle.length);
}

// 1) Quitar el condicional agregado (posible fuente del error)
const COND =
  'At==="elegir"&&Wi.size===0?e.jsx("div",{style:{textAlign:"center",padding:20,color:a.muted,fontSize:13},children:"Selecciona al menos 1 material para calcular."}):I.length===0?';
if (s.includes(COND)) {
  replaceOnce(COND, "I.length===0?", "condicional step3");
}

// 2) Quitar el bloque grande insertado después del header de Step 3
const HEADER_INSERT_PREFIX =
  'children:"3. Materiales calculados desde APU"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}';

const headerAt = s.indexOf(HEADER_INSERT_PREFIX);
if (headerAt !== -1) {
  const endAt = s.indexOf("I.length===0?", headerAt);
  if (endAt === -1) throw new Error("No se encontró fin para recorte step3");
  const fixed =
    'children:"3. Materiales calculados desde APU"}),';
  s = s.slice(0, headerAt) + fixed + s.slice(endAt);
}

if (s === s0) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_cubicacion_syntax");

