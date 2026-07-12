const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const start = c.indexOf('p === "detalle" &&');
const nextTab = c.indexOf('function Fg(', start);

if (start > -1) {
  console.log(c.substring(Math.max(0, start - 50), Math.min(start + 4000, nextTab > -1 ? nextTab + 50 : c.length)));
} else {
  console.log("Not found");
}
