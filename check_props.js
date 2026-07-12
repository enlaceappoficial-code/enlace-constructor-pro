const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const idx = c.indexOf('x==="proveedores"');
if(idx > -1) {
    console.log(c.substring(idx - 50, idx + 100));
} else {
    console.log("Not found");
}
