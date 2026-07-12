const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const sIdx = c.indexOf('x==="clients"');
if(sIdx > -1) {
    console.log(c.substring(Math.max(0, sIdx - 50), sIdx + 150));
} else {
    console.log("Could not find x==='clients'");
}
