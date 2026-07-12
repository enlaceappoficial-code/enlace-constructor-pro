const fs = require("fs");

const filePath =
  process.argv[2] ||
  "d:\\Enlace Mundo\\enlace constructor\\Proyecto Tauri\\enlace-tauri\\src\\assets\\index.js";

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const re =
  /(w=n-s,v=i\.nombre\|\|"Cliente",)x=[\s\S]*?,f='<!DOCTYPE html/;

const replacementX =
  '$1x=(()=>{var idx=0;return(t.items||[]).reduce(function(acc,I){var cant=parseFloat(I.cant)||0,precio=parseFloat(I.precio)||0,tot=cant*precio,tipo=I._tipoCosto||(I._cid?"auto":"mo"),mat=0,noMat=0;if(tipo==="mat")mat=tot;else if(tipo==="mo")noMat=tot;else{var mu=parseFloat(I._apuMatUnit)||0;mat=Math.max(0,Math.min(tot,mu*cant)),noMat=Math.max(0,tot-mat)}if(modo==="mo"&&noMat<=0)return acc;idx++;var qty=(I.cant||0)+" "+(I.unidad||"");if(modo==="separado")return acc+\'<tr><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">\'+idx+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px">\'+(I.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px">\'+qty+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\'+Math.round(noMat).toLocaleString("es-CL")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\'+Math.round(mat).toLocaleString("es-CL")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:12px">$\'+Math.round(tot).toLocaleString("es-CL")+\'</td></tr>\';if(modo==="mo"){var moUnit=cant?noMat/cant:0;return acc+\'<tr><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">\'+idx+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px">\'+(I.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px">\'+qty+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\'+Math.round(moUnit).toLocaleString("es-CL")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:12px">$\'+Math.round(noMat).toLocaleString("es-CL")+\'</td></tr>\';}return acc+\'<tr><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;color:#999;font-size:12px">\'+idx+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:12px">\'+(I.desc||"")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:12px">\'+qty+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px">$\'+Math.round(precio).toLocaleString("es-CL")+\'</td><td style="padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:12px">$\'+Math.round(tot).toLocaleString("es-CL")+\'</td></tr>\';},"")})(),f=\'<!DOCTYPE html';

if (!re.test(s)) throw new Error("No se encontró el bloque x/f del contrato para reparar.");

const m1 = s.match(re);
const after = s.slice(m1.index + 1).match(re);
if (after) throw new Error("Bloque x/f no-único; abortando.");

s = s.replace(re, () => replacementX);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_contrato_items_block");

