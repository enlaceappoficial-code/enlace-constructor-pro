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

function replaceAll(find, replace) {
  if (!s.includes(find)) return 0;
  const parts = s.split(find);
  if (parts.length === 1) return 0;
  s = parts.join(replace);
  changed += parts.length - 1;
  return parts.length - 1;
}

replaceOnce(
  'apSet=new Set(ap.map(function(Q){return parseInt(Q&&Q.catalogId)}).filter(function(Q){return isFinite(Q)})),S=y.reduce',
  'apSet=new Set(ap.map(function(Q){return parseInt(Q&&Q.catalogId)}).filter(function(Q){return isFinite(Q)})),apByCat=ap.reduce(function(Q,Z){var X=parseInt(Z&&Z.catalogId);if(!isFinite(X))return Q;var G=String(Z&&Z.nombre||"").trim();if(!G)return Q;(Q[X]=Q[X]||[]).push(G);return Q},{}),S=y.reduce'
);

replaceOnce(
  ',ie=String(Z.unidad||"").trim(),oe=apSet.has(parseInt(Z.id));return u(d({},Z),{__dup:(S[X]||0)>1,__missingPrecio:!(G>0),__missingUnidad:!ie||A(ie)==="unidad",__missingApu:!oe})',
  ',ie=String(Z.unidad||"").trim(),ae=apByCat[parseInt(Z.id)]||[],oe=ae.length>0,fe=oe?(ae.length<=2?ae.join(", "):ae.slice(0,2).join(", ")+" (+"+(ae.length-2)+")"):"—";return u(d({},Z),{__dup:(S[X]||0)>1,__missingPrecio:!(G>0),__missingUnidad:!ie||A(ie)==="unidad",__apuShort:fe,__apuTitle:ae.join(", "),__missingApu:!oe})'
);

replaceOnce(',"Unidad","Precio neto","c/IVA",""]', ',"APUs","Unidad","Precio neto","c/IVA",""]');

replaceAll(
  '},children:"Sin APU"})]}),e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:13}),children:y.unidad})',
  '},children:"Sin APU"})]}),e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:12,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}),title:y.__apuTitle||"",children:y.__apuShort||"—"}),e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:13}),children:y.unidad})'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: columna APUs aplicada (${changed} cambios).`);
