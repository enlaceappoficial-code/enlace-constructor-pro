const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

// 1) Add edit-state
{
  const from = ",[x0,f0]=V({}),[I0,D0]=V(null);";
  const to = ",[x0,f0]=V({}),[I0,D0]=V(null),[E0,M0]=V(null);";
  if (!s.includes(from)) throw new Error("No se encontró el bloque de state esperado (x0/I0) en ig().");
  s = s.replace(from, to);
}

// 2) Replace prompt button with toggle
{
  const fromStart = 'e.jsx("button",{title:"Ajustar cantidad",style:{background:"none",border:"none",cursor:"pointer",fontSize:15,color:a.accent,padding:"2px 4px",flexShrink:0},onClick:()=>{var ee=window.prompt("Cantidad a comprar (se redondea hacia arriba)",String(Math.ceil(x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad)));';
  const at = s.indexOf(fromStart);
  if (at === -1) throw new Error("No se encontró el botón de prompt para ajustar cantidad.");
  const endNeedle = '},children:"✎"})';
  const endAt = s.indexOf(endNeedle, at);
  if (endAt === -1) throw new Error("No se encontró el final del botón ✎.");
  const full = s.slice(at, endAt + endNeedle.length);
  const replacement =
    'e.jsx("button",{title:"Editar cantidad",style:{background:"none",border:"none",cursor:"pointer",fontSize:15,color:a.accent,padding:"2px 4px",flexShrink:0},onClick:()=>M0(E0===S.id?null:S.id),children:"✎"})';
  s = s.replace(full, replacement);
}

// 3) Make quantity inline-editable
{
  const from =
    'e.jsxs("span",{style:{fontSize:13,fontWeight:700,color:"var(--bdg-comp-fg)",whiteSpace:"nowrap",marginLeft:8,marginRight:8},children:[';
  const to =
    'E0===S.id?e.jsx("input",{style:u(d({},c.inp),{width:88,fontSize:13,fontWeight:800,padding:"4px 6px",textAlign:"right"}),value:x0[S.id]!=null?x0[S.id]:String(Math.ceil(S.cantidad)),onChange:ee=>f0(le=>u(d({},le),{[S.id]:ee.target.value})),onBlur:()=>{f0(le=>{var Z=String(le[S.id]||"").trim();if(Z===""){var X=u(d({},le));return delete X[S.id],X}var W=Math.ceil(parseFloat(Z)||0);return u(d({},le),{[S.id]:String(W)})});M0(null)},onKeyDown:ee=>{ee.key==="Enter"&&ee.currentTarget.blur(),ee.key==="Escape"&&(f0(le=>{var Z=u(d({},le));return delete Z[S.id],Z}),M0(null))}}):e.jsxs("span",{style:{fontSize:13,fontWeight:700,color:"var(--bdg-comp-fg)",whiteSpace:"nowrap",marginLeft:8,marginRight:8},children:[';
  if (!s.includes(from)) throw new Error("No se encontró el span de cantidad para volverlo editable.");
  s = s.replace(from, to);
}

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_desde_presupuesto_inline_edit_v3");

