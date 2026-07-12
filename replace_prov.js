const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// 1. Inject the new ModuloProveedores component code before ProveedoresModulo
const modCode = fs.readFileSync('src/assets/modulo_proveedores.js', 'utf8');
if (!c.includes('function ModuloProveedores')) {
    const idx = c.indexOf('function ProveedoresModulo(');
    if (idx > -1) {
        c = c.substring(0, idx) + '\n' + modCode + '\n' + c.substring(idx);
    }
}

// 2. Replace e.jsx(ProveedoresModulo with e.jsx(ModuloProveedores
c = c.replace(/e\.jsx\(ProveedoresModulo/g, 'e.jsx(ModuloProveedores');

fs.writeFileSync('src/assets/index.js', c);
console.log("Successfully replaced old ProveedoresModulo with new ModuloProveedores.");
