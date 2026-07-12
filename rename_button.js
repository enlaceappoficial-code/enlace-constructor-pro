const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
c = c.replace('label:"Generar Órdenes de Compra"', 'label:"📦 Centro de Adquisiciones"');
fs.writeFileSync('src/assets/index.js', c);
console.log('Renamed button');
