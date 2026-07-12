const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = '[p,C]=V(()=>pt("clients",Fn)),';
const replacementStr = '[proveedores,setProveedores]=V(()=>pt("proveedores",[])),[p,C]=V(()=>pt("clients",Fn)),';

if(c.includes(targetStr)) {
    c = c.replace(targetStr, replacementStr);
    console.log("Added proveedores state to Jg!");
    fs.writeFileSync('src/assets/index.js', c);
} else {
    console.log("Could not find targetStr");
}
