const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const idx = c.indexOf('B=[{id:"carta"');
if (idx > -1) {
  const snippet = c.substring(idx + 3000, idx + 6000);
  fs.writeFileSync('src/assets/index.js_snippet2.txt', snippet, 'utf8');
}
