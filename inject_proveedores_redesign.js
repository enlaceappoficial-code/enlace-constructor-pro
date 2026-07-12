const fs = require('fs');

let c = fs.readFileSync('src/assets/index.js', 'utf8');
const moduleCode = fs.readFileSync('src/assets/proveedores_module_redesign.js', 'utf8');

// Find the start of the old ProveedoresModulo
const startIdx = c.indexOf('function ProveedoresModulo({proveedores,');
if(startIdx > -1) {
    // Find the end of the old ProveedoresModulo
    const endMarker = 'function Jg(){';
    const endIdx = c.indexOf(endMarker, startIdx);
    
    if(endIdx > -1) {
        const oldCode = c.substring(startIdx, endIdx);
        c = c.replace(oldCode, moduleCode + '\n\n');
        fs.writeFileSync('src/assets/index.js', c);
        console.log("Successfully injected redesigned ProveedoresModulo.");
    } else {
        console.log("Could not find end marker function Jg(){");
    }
} else {
    console.log("Could not find old ProveedoresModulo.");
}
