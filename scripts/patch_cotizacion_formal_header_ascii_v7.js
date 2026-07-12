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

chunk = chunk.replaceAll("N┬░", "N");
chunk = chunk.replaceAll("Descripci├│n", "Descripcion");

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de fg (chunk igual).");

s = s.slice(0, fgStart) + chunk + s.slice(fgEnd + 1);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cotizacion_formal_header_ascii_v7");

