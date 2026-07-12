const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const startNeedle = "function Bf(t,i,r){";
const start = s.indexOf(startNeedle);
if (start === -1) throw new Error("No se encontró la función Bf (Resumen Ejecutivo - wrapper).");

const endNeedle = "}function Df(";
const end = s.indexOf(endNeedle, start);
if (end === -1) throw new Error("No se encontró el final de Bf (needle: }function Df().");

const replacement = 'function Bf(t,i,r){var n=window.open("","_blank");n.document.write(Rf(t,i,r)),n.document.close()}';

s = s.slice(0, start) + replacement + s.slice(end);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK replace_resumen_ejecutivo_bf_v2");

