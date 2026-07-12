const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from = 'm&&I.customId&&I.customId!==m.id?{_newId:I.customId}:{}';
const to =
  'm&&I.customId&&parseInt(I.customId)!==parseInt(m.id)?{_newId:parseInt(I.customId)}:{}';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");

