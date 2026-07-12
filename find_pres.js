const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const parts = c.split('"presupuestos"');
for (let i = 0; i < parts.length; i++) {
    const context = c.substring(c.indexOf('"presupuestos"', parts.slice(0, i).join('"presupuestos"').length) - 50, c.indexOf('"presupuestos"', parts.slice(0, i).join('"presupuestos"').length) + 150);
    console.log(`--- Match ${i} ---`);
    console.log(context);
}
