const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const start = c.indexOf('borderBottom:"2px solid "+th.fg');
if (start !== -1) {
    console.log(c.substring(Math.max(0, start - 200), start + 300));
} else {
    console.log("Not found using th.fg");
    const start2 = c.indexOf('setDetailTab("resumen")');
    console.log(c.substring(Math.max(0, start2 - 200), start2 + 300));
}
