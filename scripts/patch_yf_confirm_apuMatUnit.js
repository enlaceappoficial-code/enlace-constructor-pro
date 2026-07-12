const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

let count = 0;
s = s.replace(/onClick:\(\)=>l\(k,g,B\)/g, () => {
  count++;
  return "onClick:()=>l(k,g,B,v)";
});
s = s.replace(/onClick:\(\)=>l\(t\.precio\|\|k,g,B\)/g, () => {
  count++;
  return "onClick:()=>l(t.precio||k,g,B,v)";
});

if (count === 0) process.exit(2);
if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");

