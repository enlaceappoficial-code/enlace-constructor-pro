const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const qtyFrom = 'children:[+S.cantidad.toFixed(3)," ",e.jsx("span",{style:{fontSize:11,color:a.muted},children:S.unidad})]})';
const qtyTo =
  'children:[+((x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad).toFixed(3))," ",e.jsx("span",{style:{fontSize:11,color:a.muted},children:S.unidad})]})';

if (!s.includes(qtyFrom)) throw new Error("No se encontró el render de cantidad para reemplazar.");
s = s.replace(qtyFrom, qtyTo);

const insertAt = ',e.jsx("button",{title:U?"Restaurar material":"Excluir de esta cubicaci';
const at = s.indexOf(insertAt);
if (at === -1) throw new Error("No se encontró el botón excluir/restaurar para insertar el botón de ajuste.");

const adjustBtn =
  ',e.jsx("button",{title:"Ajustar cantidad",style:{background:"none",border:"none",cursor:"pointer",fontSize:15,color:a.accent,padding:"2px 4px",flexShrink:0},onClick:()=>{var ee=window.prompt("Cantidad a comprar (se redondea hacia arriba)",String(Math.ceil(x0[S.id]!=null&&x0[S.id]!==""&&!isNaN(parseFloat(x0[S.id]))?parseFloat(x0[S.id]):S.cantidad)));if(ee===null)return;f0(le=>{var Z=String(ee).trim();if(Z===""){var X=u(d({},le));return delete X[S.id],X}return u(d({},le),{[S.id]:Z})})},children:"✎"})';

s = s.slice(0, at) + adjustBtn + s.slice(at);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_desde_presupuesto_ajustar_btn_v2");

