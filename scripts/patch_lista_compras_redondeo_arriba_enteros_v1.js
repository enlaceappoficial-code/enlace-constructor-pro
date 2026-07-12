const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const r1 = /Math\.ceil\(([^)]*?)\.totalCant\*100\)\/100/g;
const r2 = /Math\.ceil\(([^)]*?)\.cant\*1000\)\/1000/g;

s = s.replace(r1, "Math.ceil($1.totalCant)");
s = s.replace(r2, "Math.ceil($1.cant)");

if (s === before) throw new Error("No se aplicaron cambios: no se encontraron patrones de redondeo en lista de compras.");

fs.writeFileSync(filePath, s, "utf8");
console.log("OK patch_lista_compras_redondeo_arriba_enteros_v1");

