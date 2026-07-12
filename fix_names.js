const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

c = c.replace('{k:"licitaciones",ic:"\\u2696\\uFE0F",l:"Licitaciones"', '{k:"licitaciones",ic:"\\u2696\\uFE0F",l:"Mercado Público"');
c = c.replace('licitaciones:"Licitaciones — Mercado Público"', 'licitaciones:"Mercado Público"');
c = c.replace('licitaciones:"Licitaciones \\u2014 Mercado Público"', 'licitaciones:"Mercado Público"');
c = c.replace('modulo:"licitaciones",l:"Licitaciones"', 'modulo:"licitaciones",l:"Mercado Público"');

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Fixed names');
