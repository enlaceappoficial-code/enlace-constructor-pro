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

function replaceRegex(re, replacement) {
  const before = s;
  s = s.replace(re, replacement);
  if (s !== before) changed++;
}

// 1) Al hacer click en un día (vista mes), abrir directamente el formulario de evento.
replaceOnce("onClick:()=>S(X.date)", "onClick:()=>{x(X.date),w(null),h(!0)}");

// 2) Deshabilitar el bloque "Notas del día" dentro de los modales (día y editor de evento),
// porque la gestión de notas ahora está arriba del calendario.
replaceRegex(
  /e\.jsxs\("div",\{style:\{marginBottom:24\},children:\[e\.jsx\("div",\{style:\{fontSize:14,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:6\},children:"[^"]*Notas del d[^"]*"\}\),/g,
  "!1&&$&"
);

replaceRegex(
  /e\.jsxs\("div",\{style:\{padding:"16px 20px",borderTop:`1px solid \$\{a\.border\}`\},children:\[e\.jsx\("div",\{style:\{fontSize:14,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:6\},children:"[^"]*Notas del d[^"]*"\}\),/g,
  "!1&&$&"
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: click día + notas modales ajustado (${changed} cambios).`);
