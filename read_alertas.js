const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /.{0,50}alertas.{0,50}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    if(match[0].includes('onClick') || match[0].includes('===') || match[0].includes('p===')) {
        console.log("MATCH:", match[0]);
    }
}
