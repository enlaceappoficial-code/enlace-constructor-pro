const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');
const start = c.indexOf('1. Región');
console.log(c.substring(start - 200, start + 2000));
