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

const needle =
  ',z=Object.values(b).reduce((w,v)=>w+v,0),B=';
if (!chunk.includes(needle)) throw new Error("No se encontró el bloque z=... ,B= en Tp.");

const replacement =
  ',z=Object.values(b).reduce((w,v)=>w+v,0);if(moBudget>0){var diff=Math.round(moBudget)-z;if(diff){var lr=m[m.length-1]&&m[m.length-1].rol;lr&&(b[lr]=(b[lr]||0)+diff);z+=diff;g=m.map(w=>\'<td style=\"text-align:right;font-weight:700\">\'+C(b[w.rol])+\"</td>\').join(\"\")}}var B=';

chunk = chunk.replace(needle, replacement);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de Tp (chunk igual).");

s = s.slice(0, start) + chunk + s.slice(end + "return B}".length);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_resumen_dotacion_total_exact_v2");
