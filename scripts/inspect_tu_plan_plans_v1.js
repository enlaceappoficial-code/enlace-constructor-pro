const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s = fs.readFileSync(filePath, "utf8");

const start = s.indexOf('s=[{key:"starter"');
console.log("start", start);
if (start < 0) process.exit(1);

let i = start + 2;
let depth = 0;
let inStr = false;
let strCh = "";
let esc = false;

for (; i < s.length; i++) {
  const c = s[i];
  if (inStr) {
    if (esc) {
      esc = false;
      continue;
    }
    if (c === "\\") {
      esc = true;
      continue;
    }
    if (c === strCh) {
      inStr = false;
      strCh = "";
    }
    continue;
  }
  if (c === '"' || c === "'") {
    inStr = true;
    strCh = c;
    continue;
  }
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) {
      const arr = s.slice(start + 2, i + 1);
      console.log("len", arr.length);
      console.log(arr.slice(0, 5000));
      console.log("\n...TRUNCATED...\n");
      console.log(arr.slice(-5000));
      break;
    }
  }
}
