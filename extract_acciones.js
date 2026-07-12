const fs = require('fs');
const c = fs.readFileSync('gg_component.txt', 'utf8');

const sIdx = c.indexOf('Acciones');
const endIdx = sIdx + 1500;
console.log(c.substring(sIdx, endIdx));
