const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const sIdx = c.indexOf('function MpBuscador(');
const str = c.substring(sIdx, sIdx + 15000);
const split = str.split('position:"fixed"');
if(split.length > 1) {
    console.log(split[1].substring(0, 1000));
}
