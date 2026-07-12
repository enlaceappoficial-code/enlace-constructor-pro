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

// 1) Asegura que el ternario de columnas quede parentizado antes del .forEach(...)
chunk = chunk.replace(
  'f.rect(A,S,P,8,"F"),ie==="separado"?',
  'f.rect(A,S,P,8,"F"),(ie==="separado"?'
);
chunk = chunk.replace(
  '}]]).forEach(Z=>{f.setFont("helvetica","bold"),f.setFontSize(7.5),f.setTextColor(255,255,255),f.text(Z.l,(Z.r,Z.x),S+5.3,{align:Z.r?"right":"left"})})',
  '}]]).forEach(Z=>{f.setFont("helvetica","bold"),f.setFontSize(7.5),f.setTextColor(255,255,255),f.text(Z.l,(Z.r,Z.x),S+5.3,{align:Z.r?"right":"left"})})'
);
// Si aún no cerró el paréntesis (caso normal), lo cierra justo antes del .forEach
chunk = chunk.replace(
  '}].forEach(Z=>{f.setFont("helvetica","bold"),f.setFontSize(7.5),f.setTextColor(255,255,255),f.text(Z.l,(Z.r,Z.x),S+5.3,{align:Z.r?"right":"left"})})',
  '}]).forEach(Z=>{f.setFont("helvetica","bold"),f.setFontSize(7.5),f.setTextColor(255,255,255),f.text(Z.l,(Z.r,Z.x),S+5.3,{align:Z.r?"right":"left"})})'
);

// 2) Labels ASCII para evitar caracteres no soportados en fuente base (y que se vean en la barra azul)
chunk = chunk.replaceAll('l:"N┬░"', 'l:"N"');
chunk = chunk.replaceAll('l:"Descripci├│n"', 'l:"Descripcion"');

// 3) Más espacio visual entre columnas (especialmente P.Unit / Total)
// Header x positions (modo completo/mo)
chunk = chunk.replaceAll("x:A+122", "x:A+120");
chunk = chunk.replaceAll("x:A+142", "x:A+140");
chunk = chunk.replaceAll("x:A+162", "x:A+154");
chunk = chunk.replaceAll("x:A+168", "x:A+160");
// Header x positions (modo separado)
chunk = chunk.replaceAll("x:A+150", "x:A+145");
chunk = chunk.replaceAll("x:A+170", "x:A+165");

// Filas: mover Cant/Unidad en completo/mo y mover P.Unit / MO Unit para separar del Total
chunk = chunk.replace(
  'f.text(""+L,(ie==="separado"?A+110:A+122),S+5.3,{align:"right"}),f.text(Z.unidad||"",(ie==="separado"?A+128:A+142),S+5.3,{align:"right"}),',
  'f.text(""+L,(ie==="separado"?A+110:A+120),S+5.3,{align:"right"}),f.text(Z.unidad||"",(ie==="separado"?A+128:A+140),S+5.3,{align:"right"}),'
);
chunk = chunk.replaceAll("A+150,S+5.3", "A+145,S+5.3");
chunk = chunk.replaceAll("A+170,S+5.3", "A+165,S+5.3");
chunk = chunk.replaceAll("A+168,S+5.3", "A+160,S+5.3");
chunk = chunk.replaceAll("A+162,S+5.3", "A+154,S+5.3");

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios dentro de fg (chunk igual).");

s = s.slice(0, fgStart) + chunk + s.slice(fgEnd + 1);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_cotizacion_formal_header_labels_spacing_v6");

