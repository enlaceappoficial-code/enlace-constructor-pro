const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const parts = c.split('label:"');
for (let i=1; i<parts.length; i++) {
    console.log('label:"' + parts[i].substring(0, 50).split('}')[0] + '}');
}
