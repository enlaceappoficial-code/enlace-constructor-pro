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

// 1) Quitar click en la columna APUs (volver a texto simple)
replaceOnce(
  'title:y.__apuTitle||"",onClick:()=>{var A=y.__apuTitle||"";if(A){if(confirm("APUs vinculadas:\\n\\n"+A+"\\n\\n┬┐Filtrar por la primera APU?")){var S=A.split(",")[0].trim();S&&w(("apu:"+S).trim())}}else r("Sin APU")},children:y.__apuShort||',
  'title:y.__apuTitle||"",children:y.__apuShort||'
);

// 2) Al abrir/editar una Partida, mostrar fichas de APUs vinculadas con sus materiales (1 o 2 columnas)
replaceOnce(
  'j.precio!==""&&e.jsxs("div",{style:{fontSize:13,color:a.accent,marginBottom:10},children:["Con IVA: ",ne(Math.round(parseFloat(j.precio||0)*1.19))]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[',
  'j.precio!==""&&e.jsxs("div",{style:{fontSize:13,color:a.accent,marginBottom:10},children:["Con IVA: ",ne(Math.round(parseFloat(j.precio||0)*1.19))]}),g!==null&&(()=>{var A=[];try{A=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_apus")||"[]")||[]}catch(E){}var S=[];try{S=JSON.parse(localStorage.getItem("enlace_constructor_pro_v1_materiales")||"[]")||[]}catch(E){}var O={};for(var U=0;U<S.length;U++){var P=S[U]||{};O[parseInt(P.id)]=P}var Z=A.filter(P=>parseInt(P&&P.catalogId)===parseInt(g));return e.jsxs("div",{style:{margin:"10px 0 14px 0",paddingTop:12,borderTop:"1px solid "+a.border},children:[e.jsx("div",{style:{fontSize:13,fontWeight:800,color:a.text,marginBottom:10},children:"APUs vinculadas"}),Z.length?e.jsx("div",{style:{display:"grid",gridTemplateColumns:Z.length>1?"1fr 1fr":"1fr",gap:12},children:Z.map(P=>{var Y=Array.isArray(P.materiales)?P.materiales:[];var L=0;var rows=Y.map((E,ii)=>{var M=O[parseInt(E.materialId)]||{};var q=Number(E.cantidad)||0;var pr=Number(M.precio)||0;var st=q*pr;L+=st;return e.jsxs("tr",{children:[e.jsx("td",{style:{padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:12,color:a.muted,width:24},children:ii+1}),e.jsx("td",{style:{padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:12,color:a.text},children:M.nombre||("Material "+E.materialId)}),e.jsx("td",{style:{padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:12,color:a.text,width:64},children:q}),e.jsx("td",{style:{padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:12,color:a.muted,width:70},children:M.unidad||"unidad"}),e.jsx("td",{style:{padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:12,color:a.text,width:86},children:ne(pr)}),e.jsx("td",{style:{padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:12,color:a.text,fontWeight:800,width:92},children:ne(Math.round(st))})]},ii)});return e.jsxs("div",{style:{border:"1px solid "+a.border,borderRadius:12,background:a.card,overflow:"hidden"},children:[e.jsxs("div",{style:{padding:"10px 12px",background:a.sb,borderBottom:"1px solid "+a.border},children:[e.jsx("div",{style:{fontWeight:900,fontSize:13,color:a.text},children:P.nombre||"APU"}),e.jsxs("div",{style:{fontSize:11,color:a.muted,marginTop:2},children:[P.categoria||P.tipo||"—"," · ",P.unidad||"unidad"]})]}),e.jsxs("div",{style:{padding:"10px 12px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},children:[e.jsx("div",{style:{fontSize:12,color:a.muted},children:"Total materiales"}),e.jsx("div",{style:{fontSize:12,fontWeight:900,color:a.accent},children:ne(Math.round(L))})]}),e.jsxs("div",{style:{overflowX:"auto"},children:[e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[e.jsx("thead",{children:e.jsxs("tr",{children:["#","Material","Cant.","Und.","P.Unit.","Subtotal"].map(Q=>e.jsx("th",{style:{textAlign:"left",padding:"6px 8px",borderBottom:"1px solid "+a.border,fontSize:11,color:a.muted,whiteSpace:"nowrap"},children:Q},Q))})}),e.jsx("tbody",{children:rows.length?rows:e.jsx("tr",{children:e.jsx("td",{colSpan:6,style:{padding:"10px 8px",color:a.muted,fontSize:12},children:"Sin materiales"}})})})]}),rows.length?e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12},children:[e.jsx("div",{style:{color:a.muted},children:"Items: "+rows.length}),e.jsx("div",{style:{color:a.muted},children:""}})}):null]}]}]}),]},P.id)})}):e.jsx("div",{style:{color:a.muted,fontSize:12},children:"Sin APUs vinculadas."})]})})(),e.jsxs("div",{style:{display:"flex",gap:8},children:['
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: fichas de APUs en detalle de Partida (${changed} cambios).`);

