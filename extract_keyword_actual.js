const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = 'Ej: pintura, construcción, mantención...';
const idx = c.indexOf(targetStr);

if (idx > -1) {
  console.log(c.substring(Math.max(0, idx - 1000), idx + 2000));
} else {
  console.log("Not found without backslashes either.");
}
