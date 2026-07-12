const fs = require("fs");

const filePath = process.argv[2];
const needles = process.argv.slice(3);
if (!filePath || needles.length === 0) process.exit(1);

const s = fs.readFileSync(filePath, "utf8");
for (const n of needles) {
  console.log(`${n}\t${s.indexOf(n)}`);
}
