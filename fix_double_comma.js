const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
c = c.replace('}),,', '}),');
fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log("Fixed double comma.");
