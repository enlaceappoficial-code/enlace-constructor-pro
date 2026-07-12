const fs = require('fs');

let index = fs.readFileSync('src/assets/index.js', 'utf8');
const prov = fs.readFileSync('src/assets/modulo_proveedores.js', 'utf8');

const start = 'function ModuloProveedores';
const endStr = 'function ReusableImageUploader'; // Wait, let's find the actual end of ModuloProveedores in index.js

const startIndex = index.indexOf(start);

// Find the function definition
let openBraces = 0;
let endIndex = -1;
let started = false;

for (let i = startIndex; i < index.length; i++) {
    if (index[i] === '{') {
        openBraces++;
        started = true;
    } else if (index[i] === '}') {
        openBraces--;
        if (started && openBraces === 0) {
            endIndex = i + 1;
            break;
        }
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = index.substring(0, startIndex) + prov + '\\n\\n' + index.substring(endIndex);
    fs.writeFileSync('src/assets/index.js', newContent);
    console.log('Successfully updated ModuloProveedores in index.js');
} else {
    console.error('Could not find bounds of ModuloProveedores');
}
