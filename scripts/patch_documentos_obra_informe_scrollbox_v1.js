const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

const needle =
  'children:p==="informe"?e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"1100px",border:"none",background:"#fff"},title:"Vista previa"})';

const replacement =
  'children:p==="informe"?e.jsx("div",{style:{width:"100%",height:"1100px",overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"1100px",border:"none",background:"#fff"},title:"Vista previa"})';

if (s0.includes(replacement)) {
  console.log("OK: ya estaba aplicado.");
  process.exit(0);
}
if (!s0.includes(needle)) {
  console.error("ERROR: no se encontró el bloque esperado para envolver Informe en scroll.");
  process.exit(2);
}

const s1 = s0.replace(needle, replacement);
fs.writeFileSync(filePath, s1, "utf8");
console.log("OK: Informe ahora queda dentro del recuadro de vista previa (scroll interno).");

