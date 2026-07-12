const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

const before =
  "function $g({budgets:t,licitaciones:i,clients:r,cfg:n,setPage:l,setEditB:o})";
const after =
  "function $g({budgets:t,licitaciones:i,clients:r,cfg:n,setPage:l,setEditB:o,setToast})";

if (!s0.includes(before)) {
  console.log("OK: no se encontró patrón (quizás ya aplicado).");
  process.exit(0);
}

const s = s0.replace(before, after);
fs.writeFileSync(filePath, s, "utf8");
console.log("OK: setToast agregado a Calendario.");
