const fs = require('fs');
const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

// Replace React.useState with V inside CaComponent
const startIdx = content.indexOf('window.CompraAgilComponent');
if (startIdx > -1) {
  const before = content.substring(0, startIdx);
  let after = content.substring(startIdx);
  
  // Replace React.useState with V only inside CaComponent text
  after = after.replace(/React\.useState/g, 'V');
  
  fs.writeFileSync(file, before + after, 'utf8');
  console.log('Fixed React.useState reference.');
} else {
  console.log('CaComponent not found.');
}
