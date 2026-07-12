const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetMenu = '{g:"Gestión",items:[{k:"clients",ic:"👥",l:"Clientes"}';
const newMenu = '{g:"Gestión",items:[{k:"proveedores",ic:"🚚",l:"Proveedores"},{k:"clients",ic:"👥",l:"Clientes"}';

if(c.includes(targetMenu)) {
    c = c.replace(targetMenu, newMenu);
    console.log("Added Proveedores to sidebar menu!");
    fs.writeFileSync('src/assets/index.js', c);
} else {
    console.log("Could not find targetMenu in sidebar.");
}
