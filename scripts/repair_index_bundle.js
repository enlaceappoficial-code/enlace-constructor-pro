const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) {
  process.exit(1);
}

let s = fs.readFileSync(filePath, "utf8");

const pattern = /replace\(`\r?\n`,"([^"]*)"\)/g;
const matches = s.match(pattern) || [];

if (matches.length === 0) {
  process.exit(2);
}

s = s.replace(pattern, 'replace(/\\n/g,"$1")');
fs.writeFileSync(filePath, s, "utf8");
