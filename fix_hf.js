const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

if (c.includes('const{total:n}=Ee(t.items,r,t.descuento,t.modoCosteo,t.sinIva);')) {
  c = c.replace('const{total:n}=Ee(t.items,r,t.descuento,t.modoCosteo,t.sinIva);', 'const{total:n}=Ee(t.items||[],r,t.descuento,t.modoCosteo,t.sinIva);');
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Fixed Hf t.items fallback");
} else {
  console.log("Not found.");
}
