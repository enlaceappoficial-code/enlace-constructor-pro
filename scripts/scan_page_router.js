const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

const needles = ['==="documentos"', '==="informe"', '==="history"', '==="presupuestos"', '==="clientes"', '==="config"'];
let idx = 0;
let count = 0;
const limit = 25;
const radius = 180;

for (const needle of needles) {
  idx = 0;
  count = 0;
  console.log(`\n=== Searching: ${needle} ===`);
  while (count < limit) {
    const at = s.indexOf(needle, idx);
    if (at === -1) break;
    const start = Math.max(0, at - radius);
    const end = Math.min(s.length, at + needle.length + radius);
    console.log(`match#${count + 1} pos=${at}`);
    console.log(s.slice(start, end).replace(/\n/g, "\\n"));
    console.log("----");
    idx = at + needle.length;
    count++;
  }
  console.log(`Total matches printed: ${count}`);
}

console.log("\nDone.");
