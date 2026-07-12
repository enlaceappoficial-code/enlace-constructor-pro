const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function mustReplace(label, needle, replacement) {
  if (s.includes(replacement)) return;
  const idx = s.indexOf(needle);
  if (idx === -1) {
    console.error(`ERROR: no se encontró el patrón (${label}).`);
    process.exit(2);
  }
  s = s.replace(needle, replacement);
  changed++;
}

// 1) Hacer que el bloque de "documentos + vista previa" sea un layout columna con alto fijo y sin scroll de página
mustReplace(
  "container-flex",
  'j&&e.jsxs("div",{children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14},children:',
  'j&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 210px)",overflow:"hidden"},children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14},children:'
);

// 2) La card de la vista previa debe ocupar el espacio restante y no empujar el layout (flex:1)
mustReplace(
  "preview-card-flex",
  'p&&x&&b&&e.jsxs("div",{style:d({},c.card),children:[',
  'p&&x&&b&&e.jsxs("div",{style:u(d({},c.card),{flex:1,minHeight:0,display:"flex",flexDirection:"column"}),children:['
);

// 3) El wrapper con borde debe crecer (flex:1) y permitir que el contenido interno se adapte a 100% alto
mustReplace(
  "preview-frame-flex",
  '):e.jsx("div",{style:{border:`1px solid ${a.border}`,borderRadius:8,overflow:"hidden"},children:',
  '):e.jsx("div",{style:{border:`1px solid ${a.border}`,borderRadius:8,overflow:"hidden",flex:1,minHeight:0,display:"flex"},children:'
);

// 4) Cambiar alturas internas a 100% para que queden dentro del recuadro y scrolleen adentro
mustReplace(
  "informe-height-100",
  'p==="informe"?e.jsx("div",{style:{width:"100%",height:"calc(100vh - 330px)",minHeight:"520px",maxHeight:"1100px",overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"calc(100vh - 330px)",minHeight:"520px",maxHeight:"1100px",border:"none",background:"#fff"},title:"Vista previa"})',
  'p==="informe"?e.jsx("div",{style:{width:"100%",height:"100%",overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"100%",border:"none",background:"#fff"},title:"Vista previa"})'
);

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: Informe queda contenido en el recuadro inferior (layout con header arriba + preview con scroll interno).");

