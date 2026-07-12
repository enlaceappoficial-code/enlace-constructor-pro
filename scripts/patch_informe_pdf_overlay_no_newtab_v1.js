const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const startNeedle = ',$=window.open("","_blank");$.document.write(`';
if (!s.includes(startNeedle)) {
  throw new Error("No se encontró el inicio de impresión del Informe (window.open).");
}
s = s.replace(startNeedle, ",pe=`");

const endNeedle = "`),$.document.close()};return e.jsxs";
if (!s.includes(endNeedle)) {
  throw new Error("No se encontró el cierre de impresión del Informe ($.document.close).");
}

const overlayCode =
  "`;var ve=document.getElementById(\"ecp_preview_overlay\");ve&&ve.remove();ve=document.createElement(\"div\");ve.id=\"ecp_preview_overlay\";ve.style.cssText=\"position:fixed;inset:0;background:rgba(0,0,0,.86);z-index:99999;display:flex;flex-direction:column\";var he=document.createElement(\"div\");he.style.cssText=\"padding:10px 12px;background:#0b1220;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center;gap:10px\";var te=document.createElement(\"div\");te.textContent=\"Vista previa — Informe de Entrega\";te.style.cssText=\"color:rgba(255,255,255,.9);font-weight:800;font-size:13px\";var be=document.createElement(\"div\");be.style.cssText=\"display:flex;gap:8px;align-items:center\";var ce=document.createElement(\"button\");ce.textContent=\"✕ Volver\";ce.style.cssText=\"padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;font-weight:800;cursor:pointer\";ce.onclick=function(){ve.remove()};var de=document.createElement(\"button\");de.textContent=\"🖨 Imprimir / PDF\";de.style.cssText=\"padding:8px 14px;border-radius:8px;border:1px solid rgba(245,160,32,.35);background:#f5a020;color:#000;font-weight:900;cursor:pointer\";var ie=document.createElement(\"iframe\");ie.style.cssText=\"flex:1;width:100%;border:none;background:#fff\";ie.srcdoc=pe;de.onclick=function(){try{ie.contentWindow.focus();ie.contentWindow.print()}catch(e){}};be.appendChild(ce);be.appendChild(de);he.appendChild(te);he.appendChild(be);ve.appendChild(he);ve.appendChild(ie);document.body.appendChild(ve)};return e.jsxs";

s = s.replace(endNeedle, overlayCode);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_informe_pdf_overlay_no_newtab_v1");

