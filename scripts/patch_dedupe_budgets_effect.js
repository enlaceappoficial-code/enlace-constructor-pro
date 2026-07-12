const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from = 'ct(()=>{var H=setTimeout(()=>_t("budgets",B),1500);return()=>clearTimeout(H)},[B])';

const to =
  'ct(()=>{var H=setTimeout(()=>{var ae=new Map();B.forEach(N=>{var de=parseInt(N.id);ae.has(de)&&ae.delete(de),ae.set(de,N)});var me=Array.from(ae.values());me.length!==B.length&&w(me);_t("budgets",me)},1500);return()=>clearTimeout(H)},[B])';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");

