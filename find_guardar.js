const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const m = c.match(/.{0,50}Guardar Configuraci.{0,50}/g);
console.log(m);
