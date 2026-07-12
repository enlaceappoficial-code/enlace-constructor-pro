const fs = require('fs');

let c = fs.readFileSync('src/assets/index.js', 'utf8');

// The new code for GeneradorOCModulo
const moduloCode = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');

// We need to replace the existing function GeneradorOCModulo inside index.js
const startToken = 'function GeneradorOCModulo({budget, onClose, cfg, setToast}) {';
const sIdx = c.indexOf(startToken);

if (sIdx > -1) {
    // Find the end of the GeneradorOCModulo block.
    // It's just before `_n.createRoot(document.getElementById("root")).render`
    const endToken = '_n.createRoot(document.getElementById("root")).render(';
    const eIdx = c.indexOf(endToken, sIdx);
    
    if (eIdx > -1) {
        c = c.substring(0, sIdx) + moduloCode + '\n' + c.substring(eIdx);
        fs.writeFileSync('src/assets/index.js', c);
        console.log("Successfully updated GeneradorOCModulo in index.js");
    } else {
        console.log("Could not find end token");
    }
} else {
    console.log("Could not find start token in index.js");
}
