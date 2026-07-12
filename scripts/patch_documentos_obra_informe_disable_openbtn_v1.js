const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

let changed = false;

// Evita abrir pestaña nueva desde el header "Abrir / Imprimir PDF" cuando el doc seleccionado es "informe"
const openFrom =
  '},v=()=>{if(b){var f=window.open("","_blank");f.document.write(b),f.document.close()}},x=';
const openTo =
  '},v=()=>{if(b&&p!=="informe"){var f=window.open("","_blank");f.document.write(b),f.document.close()}},x=';
if (s.includes(openFrom)) {
  s = s.replace(openFrom, openTo);
  changed = true;
}

// Oculta el botón "Abrir / Imprimir PDF" cuando el doc seleccionado es "informe"
const btnFrom =
  'children:"ÔÜá´©Å Confidencial ÔÇö uso interno"}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"8px 22px",fontWeight:700}),onClick:v,children:"­ƒû¿´©Å Abrir / Imprimir PDF"})]';
const btnTo =
  'children:"ÔÜá´©Å Confidencial ÔÇö uso interno"}),p!=="informe"&&e.jsx("button",{style:u(d({},c.btn("p")),{padding:"8px 22px",fontWeight:700}),onClick:v,children:"­ƒû¿´©Å Abrir / Imprimir PDF"})]';
if (s.includes(btnFrom)) {
  s = s.replace(btnFrom, btnTo);
  changed = true;
}

if (!changed) {
  throw new Error("No se aplicaron cambios (patrones no encontrados).");
}

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_documentos_obra_informe_disable_openbtn_v1");

