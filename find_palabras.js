const fs = require('fs'); 
const c = fs.readFileSync('src/assets/index.js', 'utf8'); 
let pos = 0; 
while ((pos = c.indexOf('children: "Palabras clave"', pos)) !== -1) { 
    console.log("MATCH AT", pos); 
    console.log(c.substring(pos - 100, pos + 1000)); 
    pos++; 
}
