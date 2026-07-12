const fs = require("fs");

const filePath = process.argv[2];
const needle = process.argv[3];
const limit = parseInt(process.argv[4] || "20", 10);
const radius = parseInt(process.argv[5] || "120", 10);
if (!filePath || !needle) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
let idx = 0;
let count = 0;

function lineColAt(pos) {
  let line = 1;
  let lastNl = -1;
  for (;;) {
    const nl = s.indexOf("\n", lastNl + 1);
    if (nl === -1 || nl > pos) break;
    line++;
    lastNl = nl;
  }
  return { line, col: pos - (lastNl + 1) + 1 };
}

while (count < limit) {
  const at = s.indexOf(needle, idx);
  if (at === -1) break;
  const { line, col } = lineColAt(at);
  const start = Math.max(0, at - radius);
  const end = Math.min(s.length, at + needle.length + radius);
  console.log(`match#${count + 1} pos=${at} line=${line} col=${col}`);
  console.log(JSON.stringify(s.slice(start, end)));
  idx = at + needle.length;
  count++;
}

if (count === 0) process.exit(2);
