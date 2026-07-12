const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const modCode = fs.readFileSync('src/assets/modulo_proveedores.js', 'utf8');

const sIdx = c.indexOf('function ModuloProveedores(');
if (sIdx > -1) {
    // Find the end of ModuloProveedores
    // Wait, ModuloProveedores is the last thing before createRoot!
    const rootIdx = c.indexOf('_n.createRoot(document.getElementById("root")).render(');
    if(rootIdx > -1) {
        c = c.substring(0, sIdx) + modCode + '\n\n' + c.substring(rootIdx);
        fs.writeFileSync('src/assets/index.js', c);
        console.log("Replaced ModuloProveedores successfully!");
    } else {
        console.log("Could not find createRoot.");
    }
} else {
    console.log("ModuloProveedores not found.");
}
