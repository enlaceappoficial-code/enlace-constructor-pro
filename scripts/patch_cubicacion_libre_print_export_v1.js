const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const titleNeedle = "<title>Cubic";
const at = s.indexOf(titleNeedle);
if (at === -1) throw new Error("No se encontró el HTML de impresión de Cubicación Libre (title).");

// Limit search to a local window to avoid touching other templates.
const winStart = at;
const winEnd = Math.min(s.length, at + 2500);
const win = s.slice(winStart, winEnd);

const bodyNeedle = "<body>";
const bodyAtRel = win.indexOf(bodyNeedle);
if (bodyAtRel === -1) throw new Error("No se encontró <body> en el HTML de Cubicación Libre.");

if (win.includes("window.print()") && win.includes("Descargar CSV")) {
  console.log("Ya estaba aplicado.");
  process.exit(0);
}

const toolbar =
  "<div class='np' style='display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 12px 0'>" +
  "<button onclick='window.print()' style='padding:8px 16px;background:#1a3060;color:#fff;border:none;cursor:pointer;border-radius:4px'>🖨 Imprimir / Guardar PDF</button>" +
  "<button onclick='(function(){try{var rows=[];document.querySelectorAll(\"table tbody tr\").forEach(function(tr){var cells=[].slice.call(tr.children).map(function(td){return String(td.innerText||\"\").replace(/\\s+/g,\" \").trim();});rows.push(cells);});rows.unshift([\"Material\",\"Cantidad\",\"Unidad\"]);var csv=rows.map(function(r){return r.map(function(v){v=String(v||\"\");return /[\\\",\\n]/.test(v)?\"\\\"\"+v.replace(/\\\"/g,\"\\\"\\\"\")+\"\\\"\":v;}).join(\",\");}).join(\"\\n\");var blob=new Blob([csv],{type:\"text/csv;charset=utf-8\"});var a=document.createElement(\"a\");a.href=URL.createObjectURL(blob);a.download=\"cubicacion.csv\";a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);}catch(e){alert(\"No se pudo exportar CSV\");}})()' style='padding:8px 16px;background:#182840;color:#dde4f0;border:1px solid #243a58;cursor:pointer;border-radius:4px'>⬇ Descargar CSV</button>" +
  "<span style='font-size:12px;color:#666;margin-left:auto'>Tip: en la ventana de impresión puedes seleccionar “Guardar como PDF”.</span>" +
  "</div>";

const insertPos = winStart + bodyAtRel + bodyNeedle.length;
s = s.slice(0, insertPos) + toolbar + s.slice(insertPos);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cubicacion_libre_print_export_v1");

