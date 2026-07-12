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

// 1) Marcar el contenedor de vista previa de Documentos de Obra como host para overlays
replaceOnce(
  "preview-host-id",
  '):e.jsx("div",{style:{border:`1px solid ${a.border}`,borderRadius:8,overflow:"hidden"},children:p==="informe"?',
  '):e.jsx("div",{id:"ecp_doc_preview_box",style:{position:"relative",border:`1px solid ${a.border}`,borderRadius:8,overflow:"hidden"},children:p==="informe"?'
);

// 2) Hacer que el overlay del PDF del informe se dibuje dentro del recuadro inferior si existe
replaceOnce(
  "overlay-position",
  've.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.86);z-index:99999;display:flex;flex-direction:column";',
  'var _hb=document.getElementById("ecp_doc_preview_box");ve.style.cssText=(_hb?"position:absolute;":"position:fixed;")+"inset:0;background:rgba(0,0,0,.86);z-index:99999;display:flex;flex-direction:column";'
);

// 3) Adjuntar el overlay al host cuando existe (si no, al body)
replaceOnce(
  "overlay-append",
  "document.body.appendChild(ve)",
  "(_hb||document.body).appendChild(ve)"
);

if (!changed) {
  console.log("OK: ya estaba aplicado (sin cambios).");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: la vista previa del PDF del Informe ahora tapa SOLO el recuadro inferior (no toda la pantalla).");

