const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function removeBetween(startNeedle, endNeedle) {
  const a = s.indexOf(startNeedle);
  if (a === -1) return false;
  const b = s.indexOf(endNeedle, a + startNeedle.length);
  if (b === -1) return false;
  s = s.slice(0, a) + s.slice(b + endNeedle.length);
  changed++;
  return true;
}

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

// 1) Quitar click en columna APUs (confirm)
replaceOnce(
  'title:y.__apuTitle||"",onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n┬┐Filtrar por la primera APU?")){var S=A.split(",")[0].trim();S&&w(("apu:"+S).trim())}}else r("Sin APU")},children:y.__apuShort||"ÔÇö"}),',
  'title:y.__apuTitle||"",children:y.__apuShort||"ÔÇö"}),'
);

// 2) Eliminar bloque viejo (el que dejó el JS con sintaxis frágil)
removeBetween(
  ',g!==null&&(()=>{var A=[];try{A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")||"[]")||[]}catch(E){}var S=[];try{S=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales")||"[]")||[]}catch(E){}var O={};',
  '})})(),'
);

// 3) Insertar fichas simples de APUs dentro del detalle de Partida (1 o 2 columnas)
replaceOnce(
  ']}),e.jsxs("div",{style:{display:"flex",gap:8},children:[',
  ']}),g!==null&&(()=>{var A=[];try{A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")||"[]")||[]}catch(E){}var S=[];try{S=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales")||"[]")||[]}catch(E){}var O={};for(var U=0;U<S.length;U++){var P=S[U]||{};O[parseInt(P.id)]=P}var Z=A.filter(P=>parseInt(P&&P.catalogId)===parseInt(g));return e.jsxs("div",{style:{margin:"10px 0 14px 0",paddingTop:12,borderTop:"1px solid "+a.border},children:[e.jsx("div",{style:{fontSize:13,fontWeight:900,color:a.text,marginBottom:10},children:"APUs vinculadas"}),Z.length?e.jsx("div",{style:{display:"grid",gridTemplateColumns:Z.length>1?"1fr 1fr":"1fr",gap:12},children:Z.map(P=>{var Y=Array.isArray(P.materiales)?P.materiales:[];var total=0;var rows=Y.map((E,ii)=>{var M=O[parseInt(E.materialId)]||{};var q=Number(E.cantidad)||0;var pr=Number(M.precio)||0;var st=q*pr;total+=st;return e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 70px 90px",gap:8,alignItems:"center",padding:"6px 0",borderBottom:ii===Y.length-1?"none":"1px solid "+a.border},children:[e.jsx("div",{style:{fontSize:12,color:a.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:M.nombre||"",children:M.nombre||("Material "+E.materialId)}),e.jsx("div",{style:{fontSize:12,color:a.muted,textAlign:"right"},children:q}),e.jsx("div",{style:{fontSize:12,color:a.text,fontWeight:800,textAlign:"right"},children:ne(Math.round(st))})]},ii)});return e.jsxs("div",{style:{border:"1px solid "+a.border,borderRadius:12,background:a.card,overflow:"hidden"},children:[e.jsx("div",{style:{padding:"10px 12px",background:a.sb,borderBottom:"1px solid "+a.border,fontWeight:900,fontSize:13,color:a.text},children:P.nombre||"APU"}),e.jsx("div",{style:{padding:"6px 12px",fontSize:11,color:a.muted,borderBottom:"1px solid "+a.border},children:(P.categoria||P.tipo||"—")+" · "+(P.unidad||"unidad")}),e.jsx("div",{style:{padding:"8px 12px"},children:rows.length?rows:e.jsx("div",{style:{fontSize:12,color:a.muted},children:"Sin materiales"})}),e.jsxs("div",{style:{padding:"8px 12px",background:a.sb,borderTop:"1px solid "+a.border,display:"flex",justifyContent:"space-between",fontSize:12},children:[e.jsx("div",{style:{color:a.muted},children:"Total materiales"}),e.jsx("div",{style:{color:a.accent,fontWeight:900},children:ne(Math.round(total))})]})]},P.id)})}):e.jsx("div",{style:{color:a.muted,fontSize:12},children:"Sin APUs vinculadas."})]})})(),e.jsxs("div",{style:{display:"flex",gap:8},children:['
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: reescritura fichas APUs Partida (${changed} cambios).`);

