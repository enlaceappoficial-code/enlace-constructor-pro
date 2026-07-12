const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /.{0,50}children:"Licitaciones".{0,50}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log("MATCH:", match[0]);
}
