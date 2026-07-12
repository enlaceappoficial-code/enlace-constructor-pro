const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');

const sIdx = c.indexOf('function gg({');
if (sIdx > -1) {
    const endIdx = sIdx + 5000;
    const body = c.substring(sIdx, endIdx);
    
    fs.writeFileSync('gg_component.txt', body);
    console.log("Extracted gg component.");
} else {
    console.log("Could not find gg component.");
}
