const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

function replaceOnce(needle, replacement, label) {
  const at = s.indexOf(needle);
  if (at === -1) throw new Error(`No se encontró: ${label}`);
  const at2 = s.indexOf(needle, at + needle.length);
  if (at2 !== -1) throw new Error(`No-único: ${label}`);
  s = s.slice(0, at) + replacement + s.slice(at + needle.length);
}

// 1) Headers: agregar columna "Valor unit." separada de "Costo"
replaceOnce(
  'e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 55px 72px 100px 100px 60px 28px",gap:6,marginBottom:4},children:["Descripci├│n","Cant.","Unidad","Precio","Total","HH",""].map((W,T)=>e.jsx("div",{className:T===5?"no-print":"",style:{fontSize:11,color:a.muted,textTransform:"uppercase",fontWeight:700},children:W},T))})',
  'e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 55px 28px 72px 68px 110px 100px 60px 28px",gap:6,marginBottom:4},children:["Descripci├│n","Cant.","","Unidad","Costo","Valor unit.","Total","HH",""].map((W,T)=>e.jsx("div",{className:T===7?"no-print":"",style:{fontSize:11,color:a.muted,textTransform:"uppercase",fontWeight:700},children:W},T))})',
  "headers items presupuesto"
);

// 2) Filas: separar select (_tipoCosto) y input (precio) en columnas distintas
replaceOnce(
  'e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 55px 28px 72px 100px 100px 60px 28px",gap:6,marginBottom:4,alignItems:"center"},children:[e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px"}),value:W.desc,onChange:M=>ee(T,"desc",M.target.value),placeholder:"Descripci├│nÔÇª"}),e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",textAlign:"right"}),type:"number",value:W.cant,onChange:M=>ee(T,"cant",M.target.value),min:"0"}),e.jsx("button",{title:"Calcular desde dimensiones",style:{background:a.sb,border:`1px solid ${a.border}`,borderRadius:6,color:"#34d399",cursor:"pointer",fontSize:14,padding:"4px 5px",display:"flex",alignItems:"center",justifyContent:"center"},onClick:()=>A({idx:T,unidad:(W.unidad==="m2"?"m┬▓":W.unidad==="m3"?"m┬│":W.unidad)||"m┬▓"}),children:"­ƒôÉ"}),e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px"}),value:W.unidad,onChange:M=>ee(T,"unidad",M.target.value)}),e.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center"},children:[e.jsx("select",{value:W._tipoCosto||(W._cid?"auto":"mo"),onChange:M=>ee(T,"_tipoCosto",M.target.value),style:u(d({},c.inp),{fontSize:11,padding:"6px 6px",width:64,marginRight:6,background:a.sb,color:a.text,borderColor:a.border}),children:[e.jsx("option",{value:"auto",children:"AUTO"}),e.jsx("option",{value:"mo",children:"MO"}),e.jsx("option",{value:"mat",children:"MAT"})]}),e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",textAlign:"right",borderColor:W._cid&&U?"#7c2d12":void 0}),type:"number",value:W.precio,onChange:M=>ee(T,"precio",M.target.value),min:"0"}),W._cid&&U&&e.jsx("span",{title:"Precio puede estar desactualizado (+90 d├¡as)",style:{position:"absolute",right:-16,fontSize:12,color:"#fb923c",cursor:"help"},children:"ÔÜá"})]}),e.jsx("div",{style:{textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end"},children:(parseFloat(W.cant)||0)>0&&(parseFloat(W.precio)||0)>0?e.jsx("span",{style:{fontSize:13,fontWeight:700,color:a.accent},children:((()=>{var G=parseFloat(W.cant)||0,ie=parseFloat(W.precio)||0,oe=I.modoCosteo||"completo";var ce=W._tipoCosto||(W._cid?"auto":"mo"),me=0,de=0,pe=parseFloat(W._apuMatUnit)||0;',
  'e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 55px 28px 72px 68px 110px 100px 60px 28px",gap:6,marginBottom:4,alignItems:"center"},children:[e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px"}),value:W.desc,onChange:M=>ee(T,"desc",M.target.value),placeholder:"Descripci├│nÔÇª"}),e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",textAlign:"right"}),type:"number",value:W.cant,onChange:M=>ee(T,"cant",M.target.value),min:"0"}),e.jsx("button",{title:"Calcular desde dimensiones",style:{background:a.sb,border:`1px solid ${a.border}`,borderRadius:6,color:"#34d399",cursor:"pointer",fontSize:14,padding:"4px 5px",display:"flex",alignItems:"center",justifyContent:"center"},onClick:()=>A({idx:T,unidad:(W.unidad==="m2"?"m┬▓":W.unidad==="m3"?"m┬│":W.unidad)||"m┬▓"}),children:"­ƒôÉ"}),e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px"}),value:W.unidad,onChange:M=>ee(T,"unidad",M.target.value)}),e.jsx("select",{value:W._tipoCosto||(W._cid?"auto":"mo"),onChange:M=>ee(T,"_tipoCosto",M.target.value),style:u(d({},c.inp),{fontSize:11,padding:"6px 6px",background:a.sb,color:a.text,borderColor:a.border}),children:[e.jsx("option",{value:"auto",children:"AUTO"}),e.jsx("option",{value:"mo",children:"MO"}),e.jsx("option",{value:"mat",children:"MAT"})]}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",textAlign:"right",borderColor:W._cid&&U?"#7c2d12":void 0}),type:"number",value:W.precio,onChange:M=>ee(T,"precio",M.target.value),min:"0"}),W._cid&&U&&e.jsx("span",{title:"Precio puede estar desactualizado (+90 d├¡as)",style:{position:"absolute",right:-16,fontSize:12,color:"#fb923c",cursor:"help"},children:"ÔÜá"})]}),e.jsx("div",{style:{textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end"},children:(parseFloat(W.cant)||0)>0&&(parseFloat(W.precio)||0)>0?e.jsx("span",{style:{fontSize:13,fontWeight:700,color:a.accent},children:((()=>{var G=parseFloat(W.cant)||0,ie=parseFloat(W.precio)||0,oe=I.modoCosteo||"completo";var ce=W._tipoCosto||(W._cid?"auto":"mo"),me=0,de=0,pe=parseFloat(W._apuMatUnit)||0;',
  "fila items costo + precio unit"
);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_budget_editor_unit_price_column");

