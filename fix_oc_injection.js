const fs = require('fs');

let c = fs.readFileSync('src/assets/index.js', 'utf8');

// The code for GeneradorOCModulo that was appended
const moduloCode = fs.readFileSync('src/assets/generador_oc_modulo.js', 'utf8');

// Remove it from the end if it exists there
const endStr = '\n\n' + moduloCode;
if (c.endsWith(endStr)) {
    c = c.slice(0, -endStr.length);
} else if (c.includes('function GeneradorOCModulo')) {
    // Maybe it's there but slightly different spacing. Just cut it out.
    const idx = c.indexOf('function GeneradorOCModulo');
    c = c.slice(0, idx);
}

// Now insert it INSIDE the IIFE, right before the render call
// The render call usually looks like `_n.createRoot(document.getElementById("root")).render(e.jsx(Jg,{}))`
// Let's insert it right before that.
const target = '_n.createRoot(document.getElementById("root")).render(';
if (c.includes(target) && !c.includes('function GeneradorOCModulo')) {
    c = c.replace(target, moduloCode + '\n' + target);
}

fs.writeFileSync('src/assets/index.js', c);
console.log("Fixed GeneradorOCModulo injection.");
