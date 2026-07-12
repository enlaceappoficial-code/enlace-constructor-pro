const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const target1 = 'title: "1. Regístrate en ChileProveedores",\n      desc: "Para poder ofertar, tu empresa debe estar inscrita en el registro oficial del Estado. El proceso es online y te permite participar en cualquier licitación a nivel nacional.",\n      actionText: "Ir a ChileProveedores",\n      actionUrl: "https://www.chileproveedores.cl/",\n      icon: "📝"';
const replace1 = 'title: "1. Regístrate en Mercado Público",\n      desc: "Para poder ofertar, tu empresa debe estar inscrita en el registro oficial del Estado. El proceso es online y te permite participar en cualquier licitación a nivel nacional.",\n      actionText: "Ir a Mercado Público",\n      actionUrl: "https://www.mercadopublico.cl/Home",\n      icon: "📝"';

const target2 = 'title: "2. Genera tu Ticket (Clave API)",\n      desc: "Una vez registrado, ingresa al portal de Mercado Público. Ve a \'Mi Cuenta\' > \'Seguridad\' y genera un \'Ticket\' o \'API Key\'. Este código es tu llave privada que permitirá a Enlace Constructor Pro buscar oportunidades en tiempo real por ti.",\n      icon: "🔑"';
const replace2 = 'title: "2. Genera tu Ticket (Clave API)",\n      desc: "Una vez registrado, ingresa al portal de Mercado Público. Ve a \'Mi Cuenta\' > \'Seguridad\' y genera un \'Ticket\' o \'API Key\'. Este código es tu llave privada que permitirá a Enlace Constructor Pro buscar oportunidades en tiempo real por ti.",\n      actionText: "Pedir API Key",\n      actionUrl: "https://www.chilecompra.cl/api/",\n      icon: "🔑"';

if (c.includes(target1)) {
    c = c.replace(target1, replace1);
    console.log("Replaced step 1 successfully.");
} else {
    console.log("Could not find step 1 target.");
}

if (c.includes(target2)) {
    c = c.replace(target2, replace2);
    console.log("Replaced step 2 successfully.");
} else {
    console.log("Could not find step 2 target.");
}

fs.writeFileSync('src/assets/index.js', c);
