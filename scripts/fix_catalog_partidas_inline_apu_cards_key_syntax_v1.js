const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;

const find = "),]},P.id)";
const repl = "})},P.id)";

if (!s.includes(find)) {
  console.log("OK: no se encontró el patrón de key a corregir.");
  process.exit(0);
}

s = s.split(find).join(repl);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: key P.id corregida.");

