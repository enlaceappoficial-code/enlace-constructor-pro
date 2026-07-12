const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

if (!s.includes("})}if(ae&&ae.estado")) process.exit(2);
s = s.split("})}if(ae&&ae.estado").join("});if(ae&&ae.estado");

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");

