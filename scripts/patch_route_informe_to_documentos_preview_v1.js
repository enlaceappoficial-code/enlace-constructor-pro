const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

let s = s0;
let changed = 0;

// 1) Extender Vg para soportar initBudgetId/initDocId y abrir Informe dentro del recuadro
{
  const needle =
    'function Vg({budgets:t,clients:i,cfg:r,onGoHistory:n,setPage:l,setToast:o0}){var o=t.length>0?String([...t].sort((f,I)=>I.id-f.id)[0].id):"";const[s,m]=V(o),[p,C]=V(null),[b,h]=V("");';
  const repl =
    'function Vg({budgets:t,clients:i,cfg:r,onGoHistory:n,setPage:l,setToast:o0,initBudgetId:u0,initDocId:l0}){var o=u0|| (t.length>0?String([...t].sort((f,I)=>I.id-f.id)[0].id):"");const[s,m]=V(o),[p,C]=V(l0||null),[b,h]=V(l0==="informe"?"<!DOCTYPE html><html><body></body></html>":"");';

  if (s.includes(repl)) {
    // ya aplicado
  } else if (s.includes(needle)) {
    s = s.replace(needle, repl);
    changed++;
  } else {
    console.error("ERROR: no se encontró la firma/estado inicial esperado de Vg.");
    process.exit(2);
  }
}

// 2) Redirigir la ruta x==='informe' a Documentos de Obra con informe preseleccionado (no pantalla completa)
{
  const needle =
    'if(x==="informe")return ye("informe")?e.jsx(Qg,{budgets:v,clients:p,cfg:l,setToast:Q,initBudgetId:X}):e.jsx(di,{modulo:"informe",planActual:Ce,onGoConfig:()=>f("config")});if(x==="documentos")return e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f,setToast:Q});';
  const repl =
    'if(x==="informe")return ye("informe")?e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f,setToast:Q,initBudgetId:X,initDocId:"informe"}):e.jsx(di,{modulo:"informe",planActual:Ce,onGoConfig:()=>f("config")});if(x==="documentos")return e.jsx(Vg,{budgets:v,clients:p,cfg:l,onGoHistory:()=>f("history"),setPage:f,setToast:Q});';

  if (s.includes(repl)) {
    // ya aplicado
  } else if (s.includes(needle)) {
    s = s.replace(needle, repl);
    changed++;
  } else {
    console.error("ERROR: no se encontró el bloque de ruta esperado para 'informe'/'documentos'.");
    process.exit(3);
  }
}

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: Informe ya no se abre en pantalla completa; se muestra en el recuadro de vista previa de Documentos.");

