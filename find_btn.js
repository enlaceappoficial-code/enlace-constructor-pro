const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /.{0,50}Crear Presupuesto.{0,100}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log("MATCH:", match[0]);
}
