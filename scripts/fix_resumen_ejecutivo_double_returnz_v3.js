const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const bad = "return z}return z}function Bf(";
const good = "return z}function Bf(";

if (!s.includes(bad)) throw new Error("No se encontró el patrón duplicado return z}return z}function Bf(");
s = s.replace(bad, good);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_resumen_ejecutivo_double_returnz_v3");

