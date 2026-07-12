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

const NEEDLE = 'children:"3. Materiales calculados desde APU"}),I.length===0?';

const REPL =
  'children:"3. Materiales calculados desde APU"}),e.jsxs("div",{style:{background:a.sb,border:`1px solid ${a.border}`,borderRadius:8,padding:"10px 12px",marginBottom:12},children:[e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("div",{style:{fontSize:11,color:a.muted,fontWeight:700},children:"Filtro previo:"}),e.jsx("button",{onClick:()=>ci("todos"),style:{padding:"6px 10px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,background:At==="todos"?a.accent:a.card,color:At==="todos"?"#050a10":a.muted},children:"Todos"}),e.jsx("button",{onClick:()=>ci("elegir"),style:{padding:"6px 10px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,background:At==="elegir"?a.accent:a.card,color:At==="elegir"?"#050a10":a.muted},children:"Elegir"}),e.jsx("div",{style:{marginLeft:"auto",fontSize:11,color:a.muted},children:At==="elegir"?`${Wi.size} seleccionados`:""})]}),At==="elegir"&&e.jsxs("div",{style:{marginTop:10},children:[e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx("input",{style:u(d({},c.inp),{flex:1,fontSize:12,padding:"6px 8px"}),list:"dl-materiales",value:li,onChange:S=>ui(S.target.value),placeholder:"Escribe y elige un material..."}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>{var S=String(li||"").toLowerCase().trim();if(!S)return;var O=(i||[]).find(U=>String(U.nombre||"").toLowerCase().trim()===S);O&&(di(U=>{const $=new Set(U);return $.add(O.id),$}),ui(""))},children:"Agregar"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>di(new Set),children:"Limpiar"})]}),Wi.size>0&&e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginTop:10},children:Array.from(Wi).slice(0,18).map(S=>{var O=Mi.get(S);return e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 8px",borderRadius:999,background:"var(--surface)",border:`1px solid ${a.border}`,fontSize:11,color:a.text},children:[O?O.nombre:S,e.jsx("button",{style:{background:"none",border:"none",cursor:"pointer",color:a.muted,fontSize:12,padding:0},onClick:()=>di(U=>{const $=new Set(U);return $.delete(S),$}),children:"×"})]},S)})})]})]}),(At==="elegir"&&Wi.size===0)?e.jsx("div",{style:{textAlign:"center",padding:20,color:a.muted,fontSize:13},children:"Selecciona al menos 1 material para calcular."}):I.length===0?';

replaceOnce(NEEDLE, REPL, "prefiltro step3");

if (s === s0) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_prefiltro_simple");

