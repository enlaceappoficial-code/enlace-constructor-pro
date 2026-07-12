const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const idx = c.indexOf('Informe de Entrega');
let currentIdx = idx;
for (let i = 0; i < 3; i++) {
  console.log("Found at:", currentIdx);
  console.log(c.substring(currentIdx - 200, currentIdx + 400));
  currentIdx = c.indexOf('Informe de Entrega', currentIdx + 1);
  if (currentIdx === -1) break;
}
