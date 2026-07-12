const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /#fff[0-9a-fA-F]{0,3}/g;
let match;
while ((match = regex.exec(c)) !== null) {
    console.log(c.substring(Math.max(0, match.index - 30), match.index + 40));
}
