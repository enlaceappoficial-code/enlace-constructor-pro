const fs = require('fs');
let c = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');
c = c.split('\\`').join('`');
c = c.split('\\$').join('$');
fs.writeFileSync('src/assets/generador_oc_modulo.js', c);
console.log('Fixed');
