const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const target1 = 'k:"licitaciones",ic:"⚖️",l:"Licitaciones"';
const replacement1 = 'k:"licitaciones",ic:"⚖️",l:"Mercado Público"';

const target2 = 'k:"licitaciones",ic:"\\u2696\\uFE0F",l:"Licitaciones"';
const replacement2 = 'k:"licitaciones",ic:"\\u2696\\uFE0F",l:"Mercado Público"';

if (c.includes(target1)) {
    c = c.replace(target1, replacement1);
    console.log('Replaced literal emoji sidebar item');
} else if (c.includes(target2)) {
    c = c.replace(target2, replacement2);
    console.log('Replaced unicode sidebar item');
} else {
    // If not found, use a regex to match it more safely
    c = c.replace(/\{k:"licitaciones",ic:"[^"]+",l:"Licitaciones"/, '{k:"licitaciones",ic:"⚖️",l:"Mercado Público"');
    console.log('Replaced via regex');
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
