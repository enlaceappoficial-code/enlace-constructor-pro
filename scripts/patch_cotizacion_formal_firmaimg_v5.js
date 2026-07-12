const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const fgStartNeedle = "function fg({budget:t,client:i,cfg:r,onClose:n}){";
const fgStart = s.indexOf(fgStartNeedle);
if (fgStart === -1) throw new Error("No se encontró el inicio de la función fg (Cotización Formal).");

const fgEndNeedle = "}function gg(";
const fgEnd = s.indexOf(fgEndNeedle, fgStart);
if (fgEnd === -1) throw new Error("No se encontró el final de fg (needle: }function gg().");

let chunk = s.slice(fgStart, fgEnd + 1);
const chunkBefore = chunk;

const oldNeedle =
  ',S+=Y.length*5+16,r.firma)try{var le=r.firma.startsWith("data:image/png")?"PNG":"JPEG";f.addImage(r.firma,le,A+P-50,S,48,18)}catch(Z){}';

if (!chunk.includes(oldNeedle)) {
  const alreadyNeedle = "var _fi=r.firmaImg||r.firma";
  if (chunk.includes(alreadyNeedle)) {
    console.log("SKIP: firmaImg ya soportado en fg");
    process.exit(0);
  }
  throw new Error("No se encontró el bloque de firma esperado en fg.");
}

const replacement =
  ',S+=Y.length*5+16,(r.firmaImg||r.firma))try{var _fi=r.firmaImg||r.firma,le=_fi.startsWith("data:image/png")?"PNG":"JPEG";f.addImage(_fi,le,A+P-50,S,48,18)}catch(Z){}';

chunk = chunk.replace(oldNeedle, replacement);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de fg (chunk igual).");

s = s.slice(0, fgStart) + chunk + s.slice(fgEnd + 1);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cotizacion_formal_firmaimg_v5");

