const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
let changed = 0;

function replaceAllExact(from, to) {
  const before = s;
  s = s.split(from).join(to);
  if (s !== before) changed++;
}

replaceAllExact("m.items.map", "(m.items||[]).map");
replaceAllExact("z.items.map", "(z.items||[]).map");

if (changed === 0) process.exit(2);
fs.writeFileSync(filePath, s, "utf8");
