const fs = require("fs");

const filePath = process.argv[2];
const pos = parseInt(process.argv[3] || "0", 10);
const radius = parseInt(process.argv[4] || "200", 10);
if (!filePath || !Number.isFinite(pos)) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
const start = Math.max(0, pos - radius);
const end = Math.min(s.length, pos + radius);
const before = s.slice(start, pos);
const at = s.slice(pos, pos + 1);
const after = s.slice(pos + 1, end);
process.stdout.write(before);
process.stdout.write("<<<" + at + ">>>");
process.stdout.write(after);

