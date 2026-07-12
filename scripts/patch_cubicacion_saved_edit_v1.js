const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

// 1) Add "Guardar cambios" button in saved-cubicacion header (w view)
{
  const from =
    'e.jsx("button",{style:u(d({},c.btn("g")),{marginLeft:"auto",padding:"7px 14px",fontSize:12}),onClick:()=>A(w.materiales,w.nombre),children:"🖨️ Imprimir"}),e.jsx("button",{style:u(d({},c.btn("d")),{padding:"7px 10px",fontSize:12}),onClick:()=>P(w.id),children:"🗑 Eliminar"})';

  const to =
    'e.jsx("button",{style:u(d({},c.btn("g")),{marginLeft:"auto",padding:"7px 14px",fontSize:12}),onClick:()=>A(w.materiales,w.nombre),children:"🖨️ Imprimir"}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"7px 14px",fontSize:12}),onClick:()=>{if(!w)return;var S=u(d({},w),{materiales:(w.materiales||[]).map(O=>{var U=x0[O.id];return U!=null&&U!==""&&!isNaN(parseFloat(U))?u(d({},O),{cantidad:Math.ceil(parseFloat(U)||0)}):O})});v(S);var O=z.map(U=>U.id===w.id?S:U);B(O);try{localStorage.setItem("cubicaciones_guardadas",JSON.stringify(O))}catch(U){}f0({});M0(null);l("✅ Cubicación actualizada.")},children:"💾 Guardar cambios"}),e.jsx("button",{style:u(d({},c.btn("d")),{padding:"7px 10px",fontSize:12}),onClick:()=>P(w.id),children:"🗑 Eliminar"})';

  if (!s.includes(from)) {
    throw new Error("No se encontró el header esperado de cubicación guardada (botones imprimir/eliminar).");
  }
  s = s.replace(from, to);
}

// 2) Make quantities editable in saved-cubicacion list (w.materiales)
{
  const from =
    'e.jsxs("span",{style:{fontSize:13,fontWeight:700,color:"var(--bdg-comp-fg)",whiteSpace:"nowrap",marginLeft:8},children:[(+(x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad)).toFixed(3)," ",e.jsx("span",{style:{fontSize:11,color:a.muted},children:S.unidad})]})';

  const to =
    'e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginLeft:8},children:[e.jsx("button",{title:"Editar cantidad",style:{background:"none",border:"none",cursor:"pointer",fontSize:15,color:a.accent,padding:"2px 4px",flexShrink:0},onClick:()=>M0(E0===S.id?null:S.id),children:"✎"}),E0===S.id?e.jsx("input",{style:u(d({},c.inp),{width:88,fontSize:13,fontWeight:800,padding:"4px 6px",textAlign:"right"}),value:x0[S.id]!=null?x0[S.id]:String(Math.ceil(S.cantidad)),onChange:ee=>f0(le=>u(d({},le),{[S.id]:ee.target.value})),onBlur:()=>{f0(le=>{var Z=String(le[S.id]||"").trim();if(Z===""){var X=u(d({},le));return delete X[S.id],X}var W=Math.ceil(parseFloat(Z)||0);return u(d({},le),{[S.id]:String(W)})});M0(null)},onKeyDown:ee=>{ee.key==="Enter"&&ee.currentTarget.blur(),ee.key==="Escape"&&(f0(le=>{var Z=u(d({},le));return delete Z[S.id],Z}),M0(null))}}):e.jsxs("span",{style:{fontSize:13,fontWeight:700,color:"var(--bdg-comp-fg)",whiteSpace:"nowrap"},children:[(+(x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad)).toFixed(3)," ",e.jsx("span",{style:{fontSize:11,color:a.muted},children:S.unidad})]})]})';

  if (!s.includes(from)) {
    throw new Error("No se encontró el span de cantidad en cubicación guardada (w.materiales) para volverlo editable.");
  }
  s = s.replace(from, to);
}

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_saved_edit_v1");

