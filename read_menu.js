const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /.{0,50}"Licitaciones".{0,50}/g;
let match;
while ((match = regex.exec(content)) !== null) {
    if(!match[0].includes('Crear') && !match[0].includes('Nueva') && !match[0].includes('Sincronizar') && !match[0].includes('De las')) {
        console.log("MATCH:", match[0]);
    }
}
