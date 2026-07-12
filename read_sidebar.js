const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /e\.jsx\([a-zA-Z0-9]+,\{active:x,onNavigate:H=>/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log("MATCH:", match[0]);
}
