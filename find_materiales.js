const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const sIdx = c.indexOf('x==="materiales"');
if(sIdx > -1) {
   console.log(c.substring(sIdx, sIdx + 400));
}
