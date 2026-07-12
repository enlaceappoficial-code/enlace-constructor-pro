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

const rectNeedle = 'f.rect(A,S,P,8,"F"),';
const rectAt = chunk.indexOf(rectNeedle);
if (rectAt === -1) throw new Error("No se encontró el rect del header de tabla en fg.");

const exprStart = rectAt + rectNeedle.length;
if (chunk.slice(exprStart, exprStart + 2) !== "[{") {
  if (chunk.slice(exprStart, exprStart + 20).includes('ie==="separado"')) {
    console.log("SKIP: header ya parece estar parchado");
    process.exit(0);
  }
  throw new Error("El bloque después del rect no parece ser el array de columnas esperado.");
}

const forEachNeedle =
  '.forEach(Z=>{f.setFont("helvetica","bold"),f.setFontSize(7.5),f.setTextColor(255,255,255),f.text(Z.l,(Z.r,Z.x),S+5.3,{align:Z.r?"right":"left"})})';
const forEachAt = chunk.indexOf(forEachNeedle, exprStart);
if (forEachAt === -1) throw new Error("No se encontró el forEach de columnas del header en fg.");

const colsExpr =
  'ie==="separado"?[{l:"N°",x:A+2,w:10,r:!1},{l:"Descripción",x:A+12,w:90,r:!1},{l:"Cant.",x:A+110,w:16,r:!0},{l:"Unidad",x:A+128,w:18,r:!0},{l:"MO",x:A+150,w:20,r:!0},{l:"MAT",x:A+170,w:20,r:!0},{l:"Total",x:A+P-1,w:24,r:!0}]:ie==="mo"?[{l:"N°",x:A+2,w:10,r:!1},{l:"Descripción",x:A+12,w:90,r:!1},{l:"Cant.",x:A+122,w:16,r:!0},{l:"Unidad",x:A+142,w:18,r:!0},{l:"MO Unit.",x:A+168,w:24,r:!0},{l:"Total MO",x:A+P-1,w:24,r:!0}]:[{l:"N°",x:A+2,w:10,r:!1},{l:"Descripción",x:A+12,w:90,r:!1},{l:"Cant.",x:A+122,w:16,r:!0},{l:"Unidad",x:A+142,w:18,r:!0},{l:"P.Unit.Neto",x:A+162,w:24,r:!0},{l:"Total Neto",x:A+P-1,w:24,r:!0}]';

chunk = chunk.slice(0, exprStart) + colsExpr + chunk.slice(forEachAt);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios (chunk igual).");

s = s.slice(0, fgStart) + chunk + s.slice(fgEnd + 1);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cotizacion_formal_headercols_modo_costeo_v3");

