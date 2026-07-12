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
  'return y.slice(S,O).map(P=>{var A=B(P.id),S=A.deuda>0&&A.total>0,O=A.enEjecucion>0;return e.jsxs("tr",{style:{cursor:"pointer"},onMouseEnter:U=>U.currentTarget.style.background=a.hover,onMouseLeave:U=>U.currentTarget.style.background="",onClick:()=>j(P),children:[',
  'return y.slice(S,O).map(I=>{var D=B(I.id),k=D.deuda>0&&D.total>0,R=D.enEjecucion>0;return e.jsxs("tr",{style:{cursor:"pointer"},onMouseEnter:K=>K.currentTarget.style.background=a.hover,onMouseLeave:K=>K.currentTarget.style.background="",onClick:()=>j(I),children:['
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: fix clientes map var aplicado (${changed} cambios).`);

