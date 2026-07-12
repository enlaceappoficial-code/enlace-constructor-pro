const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");

const before = s;
// Hardening for legacy data: budgets/objects without `items` should behave like empty array.
// Only targets the code pattern "<ident>.items.map" (not strings, not already-patched).
// NOTE: keep it simple: minified identifiers are \w+.
s = s.replace(/(\w+)\.items\.map/g, "($1.items||[]).map");

if (s === before) process.exit(2);
fs.writeFileSync(filePath, s, "utf8");
