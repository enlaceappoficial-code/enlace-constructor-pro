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

const LINK =
  'e.jsx("a",{href:"https://www.chilecompra.cl/api/",target:"_blank",rel:"noopener noreferrer",style:{color:"#93b4f4",textDecoration:"underline",fontWeight:900,fontSize:13},children:"https://www.chilecompra.cl/api/"})';

replaceOnce(
  'children:["Solicita el ",e.jsx("strong",{style:{color:a.text},children:"ticket de acceso de Mercado Público"})," en https://www.chilecompra.cl/api/ (ÚNICO sitio) (llega al correo registrado) y pégalo aquí. Esto habilitará la búsqueda de licitaciones en tiempo real y la importación automática de datos desde la API oficial."]',
  `children:["Solicita el ",e.jsx("strong",{style:{color:a.text},children:"ticket de acceso de Mercado Público"})," en ",${LINK}," (ÚNICO sitio) (llega al correo registrado) y pégalo aquí. Esto habilitará la búsqueda de licitaciones en tiempo real y la importación automática de datos desde la API oficial."]`
);

replaceOnce(
  '["2","Entra a ChileCompra API","Abre únicamente: https://www.chilecompra.cl/api/ (ÚNICO sitio) y solicita tu ticket API."]',
  `["2","Entra a ChileCompra API",e.jsxs("span",{children:["Abre únicamente: ",${LINK}," (ÚNICO sitio) y solicita tu ticket API."]})]`
);

replaceOnce(
  'children:["💡 ",e.jsx("strong",{style:{color:"#6b88b4"},children:"Importante:"})," El ticket API solo se solicita desde https://www.chilecompra.cl/api/ (ÚNICO sitio). Mercado Público no crea credenciales manuales; el ticket llega automáticamente al correo registrado en ChileCompra."]',
  `children:["💡 ",e.jsx("strong",{style:{color:"#6b88b4"},children:"Importante:"})," El ticket API solo se solicita desde ",${LINK}," (ÚNICO sitio). Mercado Público no crea credenciales manuales; el ticket llega automáticamente al correo registrado en ChileCompra."]`
);

replaceOnce(
  'children:"📋 Cómo obtener tu ticket (ChileCompra)"}),[["1","Inicia sesión en Mercado Público"',
  'children:"📋 Cómo obtener tu ticket (ChileCompra)"}),e.jsx("button",{style:u(d({},c.btn("p")),{padding:"7px 12px",fontSize:12,marginBottom:12}),onClick:()=>window.open("https://www.chilecompra.cl/api/","_blank"),children:"🚀 Comienza el trámite aquí"}),[["1","Inicia sesión en Mercado Público"'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: ChileCompra clickable (${changed} cambios).`);
