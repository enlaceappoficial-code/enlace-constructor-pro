const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Find the main tab rendering. 
// It looks something like: n==="presupuestos"?e.jsx(Zg,{...}):n==="apus"?...
const renderMatch = c.match(/([a-zA-Z_0-9]+)==="presupuestos"\?e\.jsx\([a-zA-Z_0-9]+,\{[^}]+\}\)/);
if (renderMatch) {
    const tabVar = renderMatch[1]; // e.g., 'n' or 'l'
    
    // We want to insert the proveedores condition right before the presupuestos condition
    const insertStr = tabVar + '==="proveedores"?e.jsx(ModuloProveedores,{cfg:W,setToast:ee}):';
    
    // Wait, let's be safe and insert it by replacing the first occurrence
    c = c.replace(renderMatch[0], insertStr + renderMatch[0]);
    console.log("Successfully injected Proveedores tab renderer!");
} else {
    console.log("Could not find the rendering switch!");
    // Fallback: look for "presupuestos"?
    const m2 = c.match(/"presupuestos"\?e\.jsx\([^\)]+\):/);
    if (m2) {
        c = c.replace(m2[0], '"proveedores"?e.jsx(ModuloProveedores,{cfg:W,setToast:ee}):' + m2[0]);
        console.log("Successfully injected using fallback!");
    }
}

fs.writeFileSync('src/assets/index.js', c);
