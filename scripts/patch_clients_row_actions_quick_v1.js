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
  'children:[e.jsx("button",{style:c.btn("g"),onClick:()=>{p(I.id),s({tipo:I.tipo||((I.contacto&&I.contacto!==I.nombre)?"empresa":"persona"),rut:I.rut||"",nombre:I.nombre,contacto:I.contacto,email:I.email,telefono:I.telefono})},children:"Ô£Å"}),e.jsx("button",{style:c.btn("d"),onClick:()=>g(I),children:"Ô£ò"})]',
  'children:[I.email&&e.jsx("a",{href:"mailto:"+I.email,style:u(d({},c.btn("s")),{textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center"}),onClick:K=>K.stopPropagation(),children:"📧"}),I.telefono&&e.jsx("a",{href:Mn(I.telefono),target:"_blank",rel:"noreferrer",style:u(d({},c.btn("s")),{textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center"}),onClick:K=>K.stopPropagation(),children:"💬"}),e.jsx("button",{style:c.btn("g"),onClick:()=>{p(I.id),s({tipo:I.tipo||((I.contacto&&I.contacto!==I.nombre)?"empresa":"persona"),rut:I.rut||"",nombre:I.nombre,contacto:I.contacto,email:I.email,telefono:I.telefono})},children:"Ô£Å"}),e.jsx("button",{style:c.btn("d"),onClick:()=>g(I),children:"Ô£ò"})]'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: acciones rápidas aplicado (${changed} cambios).`);

