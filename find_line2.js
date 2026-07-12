const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');
const searchStr = 'canal === "licitaciones" ? "1fr 1fr"';
const idx = c.indexOf(searchStr);
console.log("Index is", idx);
if (idx !== -1) {
    console.log("Line number is", c.substring(0, idx).split('\n').length);
}
