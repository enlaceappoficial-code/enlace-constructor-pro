const fs = require('fs');
let content = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /onClick:\(\)=>\{R\(null\),ae\.k!=="lista"&&Z\(null\),x==="config"&&ae\.k!=="config"&&r&&Q\("⚠️ Tienes cambios sin guardar en Configuración"\),f\(ae\.k\)\}/;

const newClick = 'onClick:()=>{R(null),ae.k!=="lista"&&Z(null),x==="config"&&ae.k!=="config"&&r&&Q("⚠️ Tienes cambios sin guardar en Configuración"),f(ae.k);if(ae.k==="licitaciones" && typeof setUnreadAlerts !== "undefined") setUnreadAlerts(0);}';

if (content.match(regex)) {
    content = content.replace(regex, newClick);
    fs.writeFileSync('src/assets/index.js', content, 'utf8');
    console.log("Badge clear logic added!");
} else {
    console.log("Could not find onClick to inject badge clear logic.");
}
