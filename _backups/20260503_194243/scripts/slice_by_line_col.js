const fs = require("fs");

const filePath = process.argv[2];
const line = parseInt(process.argv[3] || "0", 10);
const col = parseInt(process.argv[4] || "0", 10);
const radius = parseInt(process.argv[5] || "250", 10);
if (!filePath || !Number.isFinite(line) || !Number.isFinite(col) || line <= 0 || col <= 0) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");

let lineStart = 0;
let currentLine = 1;
while (currentLine < line) {
  const nl = s.indexOf("\n", lineStart);
  if (nl === -1) process.exit(2);
  lineStart = nl + 1;
  currentLine++;
}

const pos = lineStart + (col - 1);

const start = Math.max(0, pos - radius);
const end = Math.min(s.length, pos + radius);
console.log(`line:${line} col:${col} pos:${pos} start:${start} end:${end} len:${s.length}`);
console.log(JSON.stringify(s.slice(start, end)));
