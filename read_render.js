const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /e\.jsxs\("div",\{style:c\.sb,children:\[.{0,1500}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log("MATCH:", match[0]);
}
