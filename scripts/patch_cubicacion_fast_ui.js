const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

function replaceOnce(haystack, needle, replacement, label) {
  const at = haystack.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró el bloque: ${label}`);
  const at2 = haystack.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`Bloque no-único: ${label}`);
  return haystack.slice(0, at) + replacement + haystack.slice(at + needle.length);
}

const OLD_IG_HEAD =
  'function ig({budgets:t,materiales:i,catalog:r,apus:n,setToast:l}){const[o,s]=V(""),[m,p]=V([]),[C,b]=V(new Set),[h,j]=V(1),[F,g]=V(""),[z,B]=V(()=>{try{const S=localStorage.getItem("cubicaciones_guardadas");return S?JSON.parse(S):[]}catch(S){return[]}}),[w,v]=V(null);var x=t&&o?t.find(S=>S.id===parseInt(o)):null;Re.useEffect(()=>b(new Set),[o]);var f=()=>{if(!x)return[];var S={};for(const Z of x.items){var O=r&&r.find(X=>X.desc===Z.desc||X.id===Z._cid);if(O){var U=n&&n.find(X=>X.catalogId===O.id&&!X.esSubcontrato&&X.materiales&&X.materiales.length>0);if(U){var $=parseFloat(Z.cant)||0;if(!($<=0))for(const X of U.materiales){var ee=i&&i.find(W=>W.id===X.materialId);if(ee){var Y=ee.id;S[Y]||(S[Y]={id:ee.id,nombre:ee.nombre,unidad:ee.unidad,cantidad:0,partidas:[]});var le=$*(parseFloat(X.cantidad)||0);S[Y].cantidad+=le,S[Y].partidas.includes(Z.desc)||S[Y].partidas.push(Z.desc)}}}}}return Object.values(S).filter(Z=>Z.cantidad>0).sort((Z,X)=>Z.nombre.localeCompare(X.nombre))},I=f(),D=()=>{';

const NEW_IG_HEAD =
  'function ig({budgets:t,materiales:i,catalog:r,apus:n,setToast:l}){const[o,s]=V(""),[m,p]=V([]),[C,b]=V(new Set),[h,j]=V(1),[F,g]=V(""),[z,B]=V(()=>{try{const S=localStorage.getItem("cubicaciones_guardadas");return S?JSON.parse(S):[]}catch(S){return[]}}),[w,v]=V(null),[je,ke]=V(""),[At,ci]=V("todos"),[li,ui]=V(""),[Wi,di]=V(new Set);var x=t&&o?t.find(S=>S.id===parseInt(o)):null;Re.useEffect(()=>{b(new Set),ke("")},[o]);var yi=Re.useMemo(()=>{var S=new Map;for(const O of r||[])O&&(O.id!=null&&S.set("id:"+O.id,O),O.desc&&S.set("d:"+O.desc,O));return S},[r]),Pi=Re.useMemo(()=>{var S=new Map;for(const O of n||[])O&&!O.esSubcontrato&&O.materiales&&O.materiales.length>0&&!S.has(O.catalogId)&&S.set(O.catalogId,O);return S},[n]),Mi=Re.useMemo(()=>{var S=new Map;for(const O of i||[])O&&S.set(O.id,O);return S},[i]),I=Re.useMemo(()=>{if(!x)return[];if(At==="elegir"&&Wi.size===0)return[];var S={},O=At==="elegir"?Wi:null;for(const Z of x.items){var U=null;Z._cid!=null&&(U=yi.get("id:"+Z._cid)),!U&&Z.desc&&(U=yi.get("d:"+Z.desc));if(U){var $=Pi.get(U.id);if($){var ee=parseFloat(Z.cant)||0;if(!($<=0))for(const Y of $.materiales){if(O&&!O.has(Y.materialId))continue;var le=Mi.get(Y.materialId);if(le){var Zt=le.id;S[Zt]||(S[Zt]={id:le.id,nombre:le.nombre,unidad:le.unidad,cantidad:0,partidas:[]});var Xt=ee*(parseFloat(Y.cantidad)||0);S[Zt].cantidad+=Xt,S[Zt].partidas.includes(Z.desc)||S[Zt].partidas.push(Z.desc)}}}}}return Object.values(S).filter(Z=>Z.cantidad>0).sort((Z,X)=>Z.nombre.localeCompare(X.nombre))},[x,At,Wi,yi,Pi,Mi]),fi=Re.useMemo(()=>{var S=String(li||"").trim().toLowerCase();if(!S)return[];return (i||[]).filter(O=>String(O.nombre||"").toLowerCase().includes(S)).sort((O,U)=>String(O.nombre||"").localeCompare(String(U.nombre||""),"es")).slice(0,60)},[i,li]),hi=Re.useMemo(()=>{var S=String(je||"").trim().toLowerCase();if(!S)return I;return I.filter(O=>String(O.nombre||"").toLowerCase().includes(S)||(O.partidas||[]).some(U=>String(U||"").toLowerCase().includes(S)))},[I,je]),D=()=>{';

s = replaceOnce(s, OLD_IG_HEAD, NEW_IG_HEAD, "ig head (memo + filtros)");

const STEP3_HEADER = 'children:"3. Materiales calculados desde APU"}),';
const STEP3_HEADER_INSERT =
  'children:"3. Materiales calculados desde APU"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10},children:[e.jsx("div",{style:{fontSize:11,color:a.muted,fontWeight:700},children:"Filtro:"}),e.jsx("button",{onClick:()=>ci("todos"),style:{padding:"6px 10px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,background:At==="todos"?a.accent:a.sb,color:At==="todos"?"#050a10":a.muted},children:"Todos"}),e.jsx("button",{onClick:()=>ci("elegir"),style:{padding:"6px 10px",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,background:At==="elegir"?a.accent:a.sb,color:At==="elegir"?"#050a10":a.muted},children:"Elegir materiales"}),e.jsx("div",{style:{marginLeft:"auto",fontSize:11,color:a.muted},children:`${hi.length}/${I.length} visibles · ${C.size} excluidos`})]}),At==="elegir"&&e.jsxs("div",{style:{background:a.sb,border:`1px solid ${a.border}`,borderRadius:8,padding:"10px 12px",marginBottom:12},children:[e.jsx("div",{style:{fontSize:12,fontWeight:700,color:a.text,marginBottom:8},children:"Selecciona materiales (antes de calcular)"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",marginBottom:10},children:[e.jsx("input",{style:u(d({},c.inp),{flex:1,fontSize:12,padding:"6px 8px"}),value:li,onChange:S=>ui(S.target.value),placeholder:"Buscar material por nombre..."}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>di(new Set),children:"Limpiar"})]}),li.trim()===""?e.jsx("div",{style:{fontSize:12,color:a.muted},children:"Escribe para buscar materiales y seleccionarlos."}):fi.length===0?e.jsx("div",{style:{fontSize:12,color:a.muted},children:"Sin coincidencias."}):e.jsx("div",{style:{maxHeight:210,overflowY:"auto"},children:fi.map(S=>{var O=Wi.has(S.id);return e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,cursor:"pointer",background:O?"#16a34a12":"transparent"},children:[e.jsx("input",{type:"checkbox",checked:O,onChange:()=>di(U=>{const $=new Set(U);return O?$.delete(S.id):$.add(S.id),$})}),e.jsxs("div",{style:{minWidth:0,flex:1},children:[e.jsx("div",{style:{fontSize:12,color:a.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:S.nombre}),e.jsx("div",{style:{fontSize:10,color:a.muted},children:S.unidad||""})]})]},S.id)})})]})]}),';
const STEP3_EMPTY_COND = "I.length===0?";
const STEP3_EMPTY_REPL =
  'At==="elegir"&&Wi.size===0?e.jsx("div",{style:{textAlign:"center",padding:20,color:a.muted,fontSize:13},children:"Selecciona al menos 1 material para calcular."}):I.length===0?';
const STEP3_FRAGMENT_HEAD = 'e.jsxs(e.Fragment,{children:[I.map((S,O)=>{';
const STEP3_FRAGMENT_REPL =
  'e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"},children:[e.jsx("input",{style:u(d({},c.inp),{flex:1,minWidth:180,fontSize:12,padding:"6px 8px"}),value:je,onChange:S=>ke(S.target.value),placeholder:"Buscar en calculados..."}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>b(new Set),children:"Restaurar todo"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>b(new Set(I.map(S=>S.id))),children:"Excluir todo"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>b(S=>{const O=new Set(S);return hi.forEach(U=>O.delete(U.id)),O}),children:"Restaurar visibles"}),e.jsx("button",{style:u(d({},c.btn("s")),{padding:"6px 10px",fontSize:12}),onClick:()=>b(S=>{const O=new Set(S);return hi.forEach(U=>O.add(U.id)),O}),children:"Excluir visibles"})]}),hi.map((S,O)=>{';

s = replaceOnce(s, STEP3_HEADER, STEP3_HEADER_INSERT, "ig step 3 header insert");
s = replaceOnce(s, STEP3_EMPTY_COND, STEP3_EMPTY_REPL, "ig step 3 empty cond");
s = replaceOnce(s, STEP3_FRAGMENT_HEAD, STEP3_FRAGMENT_REPL, "ig step 3 fragment head");

if (s === s0) throw new Error("No se aplicaron cambios (contenido idéntico).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_fast_ui");
