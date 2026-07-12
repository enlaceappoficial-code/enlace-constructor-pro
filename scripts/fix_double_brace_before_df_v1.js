const fs = require("fs");

const filePath = process.argv[2] || "src/assets/index.js";
let s = fs.readFileSync(filePath, "utf8");
const before = s;

const bad = "}}function Df(";
const good = "}function Df(";

if (!s.includes(bad)) throw new Error("No se encontró el patrón '}}function Df('");
s = s.replace(bad, good);

if (s === before) throw new Error("No se aplicaron cambios.");
fs.writeFileSync(filePath, s, "utf8");
console.log("OK fix_double_brace_before_df_v1");

