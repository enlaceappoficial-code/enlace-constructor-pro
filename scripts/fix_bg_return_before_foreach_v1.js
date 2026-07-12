const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const bad = "},s={};return t.items.forEach(";
const good = "},s={};t.items.forEach(";

if (!s.includes(bad)) throw new Error("No se encontró el patrón bad en bg(): " + bad);
s = s.replace(bad, good);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_bg_return_before_foreach_v1");

