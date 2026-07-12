const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const idx = c.indexOf('B=[{id:"carta"');
if (idx > -1) {
  console.log(c.substring(idx, idx + 1000));
} else {
  console.log("Not found.");
}
