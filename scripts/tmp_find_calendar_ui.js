const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

const startNeedle = "function $g(";
const start = s.indexOf(startNeedle);
if (start < 0) {
  console.error("No se encontró:", startNeedle);
  process.exit(1);
}

const afterStart = s.slice(start);
const retIdx = afterStart.indexOf("return e.");
console.log("start:", start, "return:", retIdx >= 0 ? start + retIdx : -1);

function dump(pos, radius = 1400) {
  const a = Math.max(0, pos - radius);
  const b = Math.min(s.length, pos + radius);
  console.log(`\n--- slice ${a}:${b} ---\n`);
  console.log(s.slice(a, b));
}

dump(start, 900);
if (retIdx >= 0) dump(start + retIdx, 1600);
