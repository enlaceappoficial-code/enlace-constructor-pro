const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "..", "src", "assets", "index.js");
const s0 = fs.readFileSync(filePath, "utf8");

const re =
  /children:e\.jsxs\("div",\{style:\{display:"flex",gap:5\},children:\[I\.email&&e\.jsx\("a",\{href:"mailto:"\+I\.email,style:u\(d\(\{\},c\.btn\("s"\)\),\{textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center"\}\),onClick:K=>K\.stopPropagation\(\),children:"([^"]+)"\}\),I\.telefono&&e\.jsx\("a",\{href:Mn\(I\.telefono\),target:"_blank",rel:"noreferrer",style:u\(d\(\{\},c\.btn\("s"\)\),\{textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center"\}\),onClick:K=>K\.stopPropagation\(\),children:"([^"]+)"\}\),e\.jsx\("button",\{style:c\.btn\("g"\),onClick:\(\)=>\{p\(I\.id\),s\(\{tipo:I\.tipo\|\|\(\(I\.contacto&&I\.contacto!==I\.nombre\)\?"empresa":"persona"\),rut:I\.rut\|\|"",nombre:I\.nombre,contacto:I\.contacto,email:I\.email,telefono:I\.telefono\}\)\},children:"([^"]+)"\}\),e\.jsx\("button",\{style:c\.btn\("d"\),onClick:\(\)=>g\(I\),children:"([^"]+)"\}\)\]\}\)/;

if (!re.test(s0)) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

const s = s0.replace(re, (_m, mailIcon, waIcon, editIcon, delIcon) => {
  return `children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,34px)",gap:5,justifyContent:"end"},children:[I.email?e.jsx("a",{href:"mailto:"+I.email,style:u(d({},c.btn("s")),{textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",width:34,height:28,padding:0}),onClick:K=>K.stopPropagation(),children:"${mailIcon}"}):e.jsx("span",{style:{display:"inline-block",width:34,height:28}}),I.telefono?e.jsx("a",{href:Mn(I.telefono),target:"_blank",rel:"noreferrer",style:u(d({},c.btn("s")),{textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",width:34,height:28,padding:0}),onClick:K=>K.stopPropagation(),children:"${waIcon}"}):e.jsx("span",{style:{display:"inline-block",width:34,height:28}}),e.jsx("button",{style:u(d({},c.btn("g")),{width:34,height:28,padding:0}),onClick:()=>{p(I.id),s({tipo:I.tipo||((I.contacto&&I.contacto!==I.nombre)?"empresa":"persona"),rut:I.rut||"",nombre:I.nombre,contacto:I.contacto,email:I.email,telefono:I.telefono})},children:"${editIcon}"}),e.jsx("button",{style:u(d({},c.btn("d")),{width:34,height:28,padding:0}),onClick:()=>g(I),children:"${delIcon}"})]})`;
});

fs.writeFileSync(filePath, s, "utf8");
console.log("OK: layout acciones clientes aplicado (regex).");

