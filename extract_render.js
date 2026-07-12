const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const idx = c.indexOf('B=[{id:"carta"');
if (idx > -1) {
  const snippet = c.substring(idx, idx + 3000);
  fs.writeFileSync('src/assets/index.js_snippet.txt', snippet, 'utf8');
  console.log("Extracted snippet to text file");
}
