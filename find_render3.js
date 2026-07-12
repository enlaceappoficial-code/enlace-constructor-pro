const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const idx = c.indexOf('"apu"');
if (idx > -1) {
    console.log(c.substring(idx - 100, idx + 200));
} else {
    console.log("Not found");
}
