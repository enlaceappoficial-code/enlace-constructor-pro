const fs = require("fs");

const filePath = process.argv[2];
const pos = parseInt(process.argv[3] || "0", 10);
const radius = parseInt(process.argv[4] || "220", 10);
if (!filePath || !Number.isFinite(pos)) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
const start = Math.max(0, pos - radius);
const end = Math.min(s.length, pos + radius);
const slice = s.slice(start, end);
console.log(`${start}:${end}:${s.length}`);
console.log(JSON.stringify(slice));

const upTo = s.slice(0, pos);
const lines = upTo.split(/\r?\n/);
console.log(`line:${lines.length} col:${lines[lines.length - 1].length + 1}`);
