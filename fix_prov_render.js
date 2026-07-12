const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetRender = 'if(x==="clients")return e.jsx(hg,{clients:p,setClients:C,budgets:B,cfg:l,setToast:Q});';
const newRender = 'if(x==="proveedores")return e.jsx(ModuloProveedores,{cfg:l,setToast:Q});\n' + targetRender;

if(c.includes(targetRender)) {
    c = c.replace(targetRender, newRender);
    fs.writeFileSync('src/assets/index.js', c);
    console.log("Fixed providers routing!");
} else {
    console.log("Could not find targetRender!");
}
