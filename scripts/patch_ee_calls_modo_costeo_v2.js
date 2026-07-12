const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

// Add 4th argument (modoCosteo) to calls of the shape:
// Ee(X.items, cfg, X.descuento)
// but only when the 4th argument is not already present.
const re = /Ee\((\w+)\.items,([^)]*?),\1\.descuento\)/g;
let count = 0;
s = s.replace(re, (m, v, cfg) => {
  count++;
  return `Ee(${v}.items,${cfg},${v}.descuento,${v}.modoCosteo)`;
});

if (count === 0) process.exit(2);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

