const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const start = c.indexOf('📌 Mis fuentes personalizadas');
const divStart = c.lastIndexOf('e.jsxs("div",{style:u(d({},n.card),{marginTop:14})', start);
const nextElement = c.indexOf(',s==="historial"', start);

if (nextElement > -1) {
    const toRemove = c.substring(divStart, nextElement);
    console.log(toRemove);
}
