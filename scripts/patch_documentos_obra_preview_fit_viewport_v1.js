const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

const needle =
  'p==="informe"?e.jsx("div",{style:{width:"100%",height:"1100px",overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"1100px",border:"none",background:"#fff"},title:"Vista previa"})';

const h =
  'height:"calc(100vh - 330px)",minHeight:"520px",maxHeight:"1100px"';
const replacement =
  `p==="informe"?e.jsx("div",{style:{width:"100%",${h},overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",${h},border:"none",background:"#fff"},title:"Vista previa"})`;

if (s0.includes(replacement)) {
  console.log("OK: ya estaba aplicado.");
  process.exit(0);
}
if (!s0.includes(needle)) {
  console.error("ERROR: no se encontró el bloque esperado de vista previa (Documentos de Obra).");
  process.exit(2);
}

fs.writeFileSync(filePath, s0.replace(needle, replacement), "utf8");
console.log("OK: vista previa ajustada al alto de la pantalla (no tapa todo).");

