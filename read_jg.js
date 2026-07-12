const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');
const match = content.match(/const Jg=..=>\{/);
if(match) console.log(match[0]);
