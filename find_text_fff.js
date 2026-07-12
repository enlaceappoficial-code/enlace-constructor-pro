const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /text:"#fff"/g;
let match;
while ((match = regex.exec(c)) !== null) {
    console.log(c.substring(Math.max(0, match.index - 200), match.index + 200));
}
