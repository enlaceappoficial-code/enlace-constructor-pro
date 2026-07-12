const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const modCode = fs.readFileSync('src/assets/modulo_proveedores.js', 'utf8');

if (!c.includes('function ModuloProveedores(')) {
    const target = '_n.createRoot(document.getElementById("root")).render(';
    if (c.includes(target)) {
        c = c.replace(target, modCode + '\n\n' + target);
        fs.writeFileSync('src/assets/index.js', c);
        console.log("Successfully injected ModuloProveedores function!");
    } else {
        console.log("Could not find createRoot target.");
    }
} else {
    console.log("ModuloProveedores already injected.");
}
