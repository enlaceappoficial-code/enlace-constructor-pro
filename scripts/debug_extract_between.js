const fs = require("fs");

const filePath = process.argv[2];
const startNeedle = process.argv[3];
const endNeedle = process.argv[4];
if (!filePath || !startNeedle || !endNeedle) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
const a = s.indexOf(startNeedle);
const b = s.indexOf(endNeedle, a + startNeedle.length);
console.log(JSON.stringify({ a, b, len: s.length }));
if (a < 0 || b < 0) process.exit(2);
console.log("TAIL_BEFORE_END:");
console.log(s.slice(Math.max(0, b - 500), b));

