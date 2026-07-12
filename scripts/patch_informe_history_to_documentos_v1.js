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

// 1) Desde "Mis Presupuestos" -> abrir Informe dentro de Documentos de Obra (no ruta informe full)
replaceOnce(
  "history-onInforme",
  'onInforme:H=>{W(H.id),f("informe")}',
  'onInforme:H=>{W(H.id),f("documentos"),setTimeout(()=>W(null),0)}'
);

// 2) Al entrar a Documentos de Obra, si X está seteado, preseleccionar Informe + presupuesto (y luego X se limpia por setTimeout)
replaceOnce(
  "documentos-route-init",
  'if(x==="documentos")return e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f,setToast:Q});',
  'if(x==="documentos")return e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f,setToast:Q,initBudgetId:X,initDocId:X?"informe":null});'
);

// 3) Si por alguna razón se usa la ruta "informe", que el título no sugiera pantalla aparte
replaceOnce(
  "title-map-informe",
  'informe:"Informe de Entrega de Obra"',
  'informe:"Documentos de Obra"'
);

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: Informe se abre dentro de Documentos de Obra (misma pantalla, vista previa inferior).");

