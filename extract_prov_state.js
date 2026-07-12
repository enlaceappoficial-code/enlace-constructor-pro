const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const sIdx = c.indexOf('pt("proveedores",[])');
if (sIdx > -1) {
    console.log(c.substring(sIdx - 50, sIdx + 150));
} else {
    console.log("Not found!");
}
