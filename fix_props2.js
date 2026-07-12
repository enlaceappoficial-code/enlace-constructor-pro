const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetRender = 'if(x==="proveedores")return e.jsx(ModuloProveedores,{cfg:l,setToast:Q});';
const newRender = 'if(x==="proveedores")return e.jsx(ModuloProveedores,{budgets:B,apus:g,materiales:j,cfg:l,setToast:Q});';

if(c.includes(targetRender)) {
    c = c.replace(targetRender, newRender);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Fixed props!");
} else {
    console.log("Could not find targetRender!");
}
