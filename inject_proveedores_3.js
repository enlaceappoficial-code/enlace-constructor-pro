const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /n==="apus"\?e\.jsx\([^)]+\):/;
const match = c.match(regex);
if (match) {
    c = c.replace(regex, 'n==="proveedores"?e.jsx(ModuloProveedores,{cfg:W,setToast:ee}):' + match[0]);
    console.log("Injected in render switch successfully!");
} else {
    // Try other state variables
    const regex2 = /([a-z])==="apus"\?e\.jsx\([^)]+\):/;
    const match2 = c.match(regex2);
    if (match2) {
        c = c.replace(regex2, match2[1] + '==="proveedores"?e.jsx(ModuloProveedores,{cfg:W,setToast:ee}):' + match2[0]);
        console.log("Injected in render switch successfully (fallback)!");
    } else {
        console.log("Could not find apus render switch.");
    }
}

fs.writeFileSync('src/assets/index.js', c);
