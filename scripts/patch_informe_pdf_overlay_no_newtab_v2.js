const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'var ie=document.createElement("iframe");ie.style.cssText="flex:1;width:100%;border:none;background:#fff";ie.srcdoc=pe;de.onclick=function(){try{ie.contentWindow.focus();ie.contentWindow.print()}catch(e){}};';

if (!s.includes(from)) {
  throw new Error("No se encontró el bloque de iframe/print del overlay (v1).");
}

const to =
  'var ie=document.createElement("iframe");ie.style.cssText="flex:1;width:100%;border:none;background:#fff";try{ie.srcdoc=pe}catch(e){};de.onclick=function(){try{var g0=ie.contentWindow;if(g0){try{var d0=g0.document;if(d0&&(!d0.body||!d0.body.innerHTML||d0.body.innerHTML.trim()===\"\")){d0.open();d0.write(pe);d0.close()}}catch(e){}g0.focus();g0.print();return}}catch(e){}try{var t0=document.createElement(\"iframe\");t0.style.cssText=\"position:fixed;right:0;bottom:0;width:1px;height:1px;opacity:0;pointer-events:none\";document.body.appendChild(t0);var d1=t0.contentWindow&&t0.contentWindow.document;if(d1){d1.open();d1.write(pe);d1.close();t0.contentWindow.focus();t0.contentWindow.print()}setTimeout(function(){t0.remove&&t0.remove()},800)}catch(e){}};';

s = s.replace(from, to);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_informe_pdf_overlay_no_newtab_v2");

