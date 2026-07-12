const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');
const match = content.match(/(function [A-Za-z]+\(\)\{[\s\S]{0,1000}pt\("cfg",Ct\))/);
if(match) console.log(match[0].substring(0, 100));
