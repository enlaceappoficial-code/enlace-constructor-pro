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

chunk = chunk.replace(
  "@media print{button{display:none}}@page{size:A4 landscape;margin:12mm 10mm}",
  "@media print{button{display:none}}"
);

chunk = chunk.replace(
  '<th style="text-align:center">HH estimadas</th><th style="text-align:right">MO</th><th style="text-align:right">GG</th><th style="text-align:right">Util</th><th style="text-align:right">Total MO</th>\'+F+',
  '<th style="text-align:center">HH estimadas</th>\'+F+'
);

chunk = chunk.replace(
  "h+=I;var itemMo=0,itemGG=0,itemUtil=0,itemTot=0;var k=m.map(",
  "h+=I;var k=m.map("
);

chunk = chunk.replace(
  "P=Math.round(y*K/Math.max(1,m.length)*scale);itemMo+=P;return b[R.rol]=(b[R.rol]||0)+P,",
  "P=Math.round(y*K/Math.max(1,m.length)*scale);return b[R.rol]=(b[R.rol]||0)+P,"
);

chunk = chunk.replace(
  "}).join(\"\");itemGG=Math.round(itemMo*(ggPct/100));itemUtil=Math.round((itemMo+itemGG)*(utilPct/100));itemTot=itemMo+itemGG+itemUtil;return\"<tr><td>\"+w.desc+",
  "}).join(\"\");return\"<tr><td>\"+w.desc+"
);

chunk = chunk.replace(
  '"+I+" HH</td><td style="text-align:right,font-weight:700">\'+C(itemMo)+\'</td>',
  '"+I+" HH</td>'
);

// Revert simple: elimina las celdas extra agregadas antes de k (match amplio)
chunk = chunk.replace(
  '+" HH</td><td style="text-align:right;font-weight:700">\'+C(itemMo)+\'</td><td style="text-align:right">\'+C(itemGG)+\'</td><td style="text-align:right">\'+C(itemUtil)+\'</td><td style="text-align:right;font-weight:700">\'+C(itemTot)+\'</td>\'+k+"</tr>"',
  '+" HH</td>"+k+"</tr>"'
);

chunk = chunk.replace(
  '"+h.toFixed(1)+" HH</td><td style="text-align:right;font-weight:800">\'+C(z)+\'</td><td style="text-align:right;font-weight:800">\'+C(ggR)+\'</td><td style="text-align:right;font-weight:800">\'+C(utilR)+\'</td><td style="text-align:right;font-weight:900">\'+C(z+ggR+utilR)+\'</td>\'+g+\'',
  '"+h.toFixed(1)+" HH</td>"+g+"'
);

if (chunk === chunkBefore) throw new Error("No se aplicaron cambios (chunk igual).");

s = s.slice(0, start) + chunk + s.slice(end + "return B}".length);
if (s === before) throw new Error("No se aplicaron cambios (archivo igual).");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK revert_resumen_dotacion_columnas_v5");

