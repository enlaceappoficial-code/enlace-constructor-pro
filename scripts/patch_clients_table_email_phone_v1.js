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

// 1) Headers: agregar Email + Teléfono
replaceOnce(
  'children:["ID","Nombre","Contacto","Presup.","Deuda","Estado",""].map(I=>e.jsx("th",{style:c.th,children:I},I))',
  'children:["ID","Nombre","Contacto","Email","Teléfono","Presup.","Deuda","Estado",""].map(I=>e.jsx("th",{style:c.th,children:I},I))'
);

// 2) Filas: después de Contacto agregar columnas interactivas Email y Teléfono (WhatsApp)
replaceOnce(
  'e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:13}),children:I.contacto}),e.jsx("td",{style:u(d({},c.td),{textAlign:"center",fontSize:13}),children:D.total>0?D.total:"—"}),',
  'e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:13}),children:I.contacto}),' +
    'e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:13}),children:I.email?e.jsx("a",{href:"mailto:"+I.email,style:{color:"#38bdf8",textDecoration:"none"},onClick:K=>K.stopPropagation(),children:I.email}):"—"}),' +
    'e.jsx("td",{style:u(d({},c.td),{color:a.muted,fontSize:13}),children:I.telefono?e.jsx("a",{href:(()=>{var K=(I.telefono||"").toString().replace(/[^0-9]/g,"");return K.length===9&&K[0]==="9"?"https://wa.me/56"+K:"https://wa.me/"+K})(),target:"_blank",rel:"noreferrer",style:{color:"#4ade80",textDecoration:"none"},onClick:K=>K.stopPropagation(),children:I.telefono}):"—"}),' +
    'e.jsx("td",{style:u(d({},c.td),{textAlign:"center",fontSize:13}),children:D.total>0?D.total:"—"}),'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: Clientes tabla email/telefono aplicado (${changed} cambios).`);

