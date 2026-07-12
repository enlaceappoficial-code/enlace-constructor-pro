const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /if\(p==="analisis"\)\{.{0,1500}/s;
const match = content.match(regex);
if(match) console.log(match[0]);
