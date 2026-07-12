const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const originalLength = c.length;
c = c.replace(/\\\\u([0-9A-Fa-f]{4})/g, (m, p1) => String.fromCharCode(parseInt(p1, 16)));

if (c.length !== originalLength) {
    fs.writeFileSync('src/assets/index.js', c, 'utf8');
    console.log('Fixed double-escaped unicode characters in index.js');
} else {
    console.log('No double-escaped unicode characters found.');
}
