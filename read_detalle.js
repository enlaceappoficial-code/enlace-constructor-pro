const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');
const idx = c.indexOf('p === "detalle"');
if (idx > -1) {
  console.log(c.substring(Math.max(0, idx - 100), idx + 2000));
} else {
  console.log("Not found");
}
