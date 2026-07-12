const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(label, needle, replacement) {
  if (s.includes(replacement)) return;
  const idx = s.indexOf(needle);
  if (idx === -1) {
    console.error(`ERROR: no se encontró el patrón (${label}).`);
    process.exit(2);
  }
  s = s.replace(needle, replacement);
  changed++;
}

// 1) Permitir scroll normal de la página (no layout fijo)
replaceOnce(
  "root-no-fixed-height",
  'x=B.find(f=>f.id===p);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 92px)",overflow:"hidden"},children:[',
  'x=B.find(f=>f.id===p);return e.jsxs("div",{children:['
);

// 2) Permitir que las tarjetas suban/bajen (no contenedor con overflow hidden)
replaceOnce(
  "cards-scroll-normal",
  'j&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1,minHeight:0,overflow:"hidden"},children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14},children:',
  'j&&e.jsxs("div",{children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14},children:'
);

// 3) Quitar estilos flex del panel de vista previa (para que siga el flujo normal)
replaceOnce(
  "preview-card-default",
  'p&&x&&b&&e.jsxs("div",{style:u(d({},c.card),{flex:1,minHeight:0,display:"flex",flexDirection:"column"}),children:[',
  'p&&x&&b&&e.jsxs("div",{style:d({},c.card),children:['
);

// 4) Quitar flex del wrapper del iframe (flujo normal)
replaceOnce(
  "preview-frame-default",
  '):e.jsx("div",{style:{border:`1px solid ${a.border}`,borderRadius:8,overflow:"hidden",flex:1,minHeight:0,display:"flex"},children:',
  '):e.jsx("div",{style:{border:`1px solid ${a.border}`,borderRadius:8,overflow:"hidden"},children:'
);

// 5) Volver a una altura grande como el resto de documentos (y scroll interno solo para el informe)
replaceOnce(
  "preview-height-1100",
  'children:p==="informe"?e.jsx("div",{style:{width:"100%",height:"100%",overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"100%",border:"none",background:"#fff"},title:"Vista previa"})',
  'children:p==="informe"?e.jsx("div",{style:{width:"100%",height:"1100px",overflowY:"auto",background:a.sb},children:e.jsx(Qg,{budgets:t,clients:i,cfg:r,setToast:o0||(()=>{}),initBudgetId:s})}):e.jsx("iframe",{srcDoc:b,style:{width:"100%",height:"1100px",border:"none",background:"#fff"},title:"Vista previa"})'
);

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: Documentos de Obra vuelve a scroll normal; Informe queda en vista previa (no pantalla completa) con panel grande.");

