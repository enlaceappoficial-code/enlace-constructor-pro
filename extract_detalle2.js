const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const start = c.indexOf('["Cierre", t.fechaCierre || "—"]');
const end = c.indexOf('}function Fg({', start);

if (start > -1) {
  console.log(c.substring(Math.max(0, start - 50), Math.min(start + 4000, end > -1 ? end + 50 : c.length)));
} else {
  console.log("Not found");
}
