const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");
let s = s0;
let changed = 0;

function replaceOnce(find, replace) {
  const idx = s.indexOf(find);
  if (idx === -1) return false;
  s = s.slice(0, idx) + replace + s.slice(idx + find.length);
  changed++;
  return true;
}

replaceOnce(
  'children:["Cuando recibas el ",e.jsx("strong",{style:{color:a.text},children:"ticket de acceso de Mercado Público"}),", pégalo aquí. Esto habilitará la búsqueda de licitaciones en tiempo real y la importación automática de datos directamente desde la API oficial."]',
  'children:["Solicita el ",e.jsx("strong",{style:{color:a.text},children:"ticket de acceso de Mercado Público"})," en https://www.chilecompra.cl/api/ (llega al correo registrado) y pégalo aquí. Esto habilitará la búsqueda de licitaciones en tiempo real y la importación automática de datos desde la API oficial."]'
);

replaceOnce(
  'placeholder:"Pega aquí tu ticket cuando llegue al email: info@redenlace.cl"',
  'placeholder:"Pega aquí tu ticket cuando llegue al correo registrado en ChileCompra (Clave Única)"'
);

replaceOnce(
  'children:"📋 Cómo obtener tu ticket en 5 minutos"}),[[',
  'children:"📋 Cómo obtener tu ticket (ChileCompra)"}),[['
);

replaceOnce(
  `[["1","Inicia sesión en Mercado Público","Entra a mercadopublico.cl con el RUT y clave de tu empresa. Debes estar registrado como proveedor."],["2","Ve al portal de la API","En tu navegador abre: api.mercadopublico.cl y busca la opción de contacto o solicitud de acceso."],["3","Completa el formulario","Ingresa tu nombre, RUT, email y en el campo 'Motivo' selecciona la opción de solicitar acceso. En el mensaje escribe: 'Solicito ticket API para integrar búsqueda de licitaciones en sistema de gestión de obras propio'."],["4","Espera el email","En 1-3 días hábiles recibirás un email con tu ticket. El formato es una clave larga tipo: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"],["5","Pégalo aquí y guarda","Copia el ticket del email, pégalo en el campo de arriba y haz clic en Guardar. ¡Listo!"]]`,
  `[["1","Inicia sesión en Mercado Público","Inicia sesión en https://www.mercadopublico.cl con tu cuenta (RUT/Clave Única según corresponda)."],["2","Entra a ChileCompra API","Abre únicamente: https://www.chilecompra.cl/api/ y solicita tu ticket API."],["3","Completa el formulario","Completa el formulario en ChileCompra. Mercado Público no crea credenciales manuales para la API."],["4","Recibe el ticket por correo","El ticket llega automáticamente al correo electrónico registrado en ChileCompra (Clave Única)."],["5","Pégalo en ECP y guarda","Copia el ticket del correo, pégalo en el campo de arriba y haz clic en Guardar."]]`
);

replaceOnce(
  'children:["💡 ",e.jsx("strong",{style:{color:"#6b88b4"},children:"¿Por qué necesitas tu propio ticket?"})," La API de Mercado Público es gratuita pero se otorga por empresa. Tener el tuyo propio garantiza que las búsquedas sean exclusivas para tu negocio, sin límites compartidos con otros usuarios."]',
  'children:["💡 ",e.jsx("strong",{style:{color:"#6b88b4"},children:"Importante:"})," El ticket API solo se solicita desde https://www.chilecompra.cl/api/. Mercado Público no crea credenciales manuales; el ticket llega automáticamente al correo registrado en ChileCompra."]'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: tutorial Mercado Público (Integraciones) actualizado (${changed} cambios).`);
