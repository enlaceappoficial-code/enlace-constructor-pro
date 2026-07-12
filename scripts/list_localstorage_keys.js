const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
const re = /localStorage\.getItem\("([^"]+)"\)/g;
const keys = new Set();
let m;
while ((m = re.exec(s))) keys.add(m[1]);

console.log([...keys].sort().join("\n"));
