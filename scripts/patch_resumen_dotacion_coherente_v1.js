const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const startNeedle = "function Tp(t,i,r){";
const start = s.indexOf(startNeedle);
if (start === -1) throw new Error("No se encontró la función Tp (Resumen de Dotación).");

const endNeedle = "return B}function Ff(";
const end = s.indexOf(endNeedle, start);
if (end === -1) throw new Error("No se encontró el final de Tp (needle: return B}function Ff().");

let chunk = s.slice(start, end + "return B}".length);
const chunkBefore = chunk;

// Inserta cálculo de presupuesto MO (neto) y factor de escala para que el total por rol sea coherente con el presupuesto.
chunk = chunk.replace(
  "var h=0,j=p.map(",
  'var modo=t.modoCosteo||"completo",tot=Ee(p,r,t.descuento,modo)||{},moBudget=modo==="mo"?Number(tot.sub)||0:Number(tot.noMatSub||tot.sub)||0,avgJ=m.reduce((w,v)=>w+(parseFloat(v.jornal)||0),0)/Math.max(1,m.length),baseTotal=p.reduce((w,v)=>{var rr=parseFloat(v._rendimiento)||0,dd=parseFloat(v._dotacion)||1,cc=parseFloat(v.cant)||0,hh=rr>0?Math.round(cc/rr*dd*8*10)/10:0;return hh?w+(hh/8)*avgJ:w},0),scale=baseTotal>0&&moBudget>0?moBudget/baseTotal:1;var h=0,j=p.map('
);

// Reemplaza el cálculo inflado (jornal^2 y *m.length) por uno proporcional al presupuesto.
chunk = chunk.replace(
  "var D=m.reduce((R,K)=>(parseFloat(K.jornal)||0)+R,0),k=m.map(R=>{var K=parseFloat(R.jornal)||0,y=I/8,P=Math.round(y*K*(K/D)*m.length);",
  "var k=m.map(R=>{var K=parseFloat(R.jornal)||0,y=I/8,P=Math.round(y*K/Math.max(1,m.length)*scale);"
);

// Ajusta redondeos para que el total mostrado sea exactamente el presupuesto MO (neto) cuando esté disponible.
chunk = chunk.replace(
  'var F=m.map(w=>\'<th style="text-align:right">\'+w.rol+\'<br><small style="font-weight:400;opacity:.8">$\' +Math.round(w.jornal).toLocaleString("es-CL")+"/d├¡a</small></th>\').join(""),g=m.map(w=>\'<td style="text-align:right;font-weight:700">\'+C(b[w.rol])+"</td>\').join(""),z=Object.values(b).reduce((w,v)=>w+v,0),B=',
  'var F=m.map(w=>\'<th style="text-align:right">\'+w.rol+\'<br><small style="font-weight:400;opacity:.8">$\' +Math.round(w.jornal).toLocaleString("es-CL")+"/d├¡a</small></th>\').join(""),g=m.map(w=>\'<td style="text-align:right;font-weight:700">\'+C(b[w.rol])+"</td>\').join(""),z=Object.values(b).reduce((w,v)=>w+v,0);if(moBudget>0){var diff=Math.round(moBudget)-z;if(diff){var lr=m[m.length-1]&&m[m.length-1].rol;lr&&(b[lr]=(b[lr]||0)+diff);z+=diff;g=m.map(w=>\'<td style="text-align:right;font-weight:700">\'+C(b[w.rol])+"</td>\').join("")}}var B='
);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de Tp (chunk igual).");

s = s.slice(0, start) + chunk + s.slice(end + "return B}".length);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_resumen_dotacion_coherente_v1");

