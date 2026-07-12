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
  'children:f.map(y=>e.jsxs("tr",{onMouseEnter:P=>P.currentTarget.style.background=a.hover,onMouseLeave:P=>P.currentTarget.style.background="",children:[',
  'children:f.map(y=>e.jsxs("tr",{onMouseEnter:P=>P.currentTarget.style.background=a.hover,onMouseLeave:P=>P.currentTarget.style.background="",onClick:()=>{z(y.id),h(y.cat),m(!1),F({desc:y.desc,unidad:y.unidad,precio:y.precio})},style:{cursor:"pointer"},children:['
);

replaceOnce(
  'e.jsx("button",{style:c.btn("g"),onClick:()=>{z(y.id),h(y.cat),m(!1),F({desc:y.desc,unidad:y.unidad,precio:y.precio})},children:',
  'e.jsx("button",{style:c.btn("g"),onClick:P=>{P.stopPropagation();z(y.id),h(y.cat),m(!1),F({desc:y.desc,unidad:y.unidad,precio:y.precio})},children:'
);

replaceOnce(
  'e.jsx("button",{style:c.btn("d"),onClick:()=>x(y),children:',
  'e.jsx("button",{style:c.btn("d"),onClick:P=>{P.stopPropagation();x(y)},children:'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: click en fila Partida aplicado (${changed} cambios).`);
