const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

let changed = false;

// 1) Pasar setToast desde el router hacia Documentos de Obra (Vg)
const routerFrom =
  'if(x==="documentos")return e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f});';
const routerTo =
  'if(x==="documentos")return e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f,setToast:Q});';
if (s.includes(routerFrom)) {
  s = s.replace(routerFrom, routerTo);
  changed = true;
}

// 2) Agregar setToast al signature de Vg (sin colisionar con var o interno)
const vgSigFrom = "function Vg({budgets:t,clients:i,cfg:r,onGoHistory:n,setPage:l}){";
const vgSigTo = "function Vg({budgets:t,clients:i,cfg:r,onGoHistory:n,setPage:l,setToast:o0}){";
if (s.includes(vgSigFrom)) {
  s = s.replace(vgSigFrom, vgSigTo);
  changed = true;
}

// 3) Cuando se selecciona Informe en Documentos de Obra, no usar Jf0 (preview simple),
// sino activar el contenedor y renderizar Qg (módulo real) dentro.
const chainFrom =
  ':f.id==="informe"?h(Jf0(j,F,r)):f.id==="desglose"?h(Pp(j,F,r))';
const chainTo =
  ':f.id==="informe"?h("<!DOCTYPE html><html><body></body></html>"):f.id==="desglose"?h(Pp(j,F,r))';
if (s.includes(chainFrom)) {
  s = s.replace(chainFrom, chainTo);
  changed = true;
}

// 4) No mostrar el botón "Abrir / Imprimir PDF" cuando el documento es Informe (porque Qg ya trae su propio PDF)
const btnNeedle =
  '),children:[p==="negociacion"&&e.jsx("span",{style:{fontSize:11,color:"#f87171",fontWeight:600},children:"ÔÜá´©Å Confidencial ÔÇö uso interno"}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"8px 22px",fontWeight:700}),onClick:v,children:"­ƒû¿´©Å Abrir / Imprimir PDF"})]})]';
if (s.includes(btnNeedle)) {
  const btnPatch =
    '),children:[p==="negociacion"&&e.jsx("span",{style:{fontSize:11,color:"#f87171",fontWeight:600},children:"ÔÜá´©Å Confidencial ÔÇö uso interno"}),p!=="informe"&&e.jsx("button",{style:u(d({},c.btn("p")),{padding:"8px 22px",fontWeight:700}),onClick:v,children:"­ƒû¿´©Å Abrir / Imprimir PDF"})]})]';
  s = s.replace(btnNeedle, btnPatch);
  changed = true;
}

// 5) Reemplazar iframe srcDoc por render condicional: Informe => Qg embebido, otros => iframe
const iframeNeedle =
  'children:e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"1100px",border:"none",background:"#fff"},title:"Vista previa"})';
if (s.includes(iframeNeedle)) {
  const iframePatch =
    'children:p==="informe"?e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"1100px",border:"none",background:"#fff"},title:"Vista previa"})';
  s = s.replace(iframeNeedle, iframePatch);
  changed = true;
}

if (!changed) {
  throw new Error("No se aplicaron cambios (patrones no encontrados).");
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_documentos_obra_informe_embed_qg_v1");

