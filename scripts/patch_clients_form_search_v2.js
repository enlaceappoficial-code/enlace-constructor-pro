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

function replaceRegex(re, replacement) {
  const before = s;
  s = s.replace(re, replacement);
  if (s !== before) changed++;
}

// Estado del formulario + buscador
replaceOnce(
  'function hg({clients:t,setClients:i,budgets:r,cfg:n,setToast:l}){const[o,s]=V({nombre:"",contacto:"",email:"",telefono:""}),[m,p]=V(null),',
  'function hg({clients:t,setClients:i,budgets:r,cfg:n,setToast:l}){const[o,s]=V({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""}),[m,p]=V(null),[q,J]=V(""),'
);

// Guardar: contacto automático si es persona
replaceRegex(
  /u\(d\(\{\},o\),\{id:m\}\)/g,
  'u(d({},o),{contacto:o.tipo==="persona"?o.nombre:o.contacto,id:m})'
);
replaceRegex(
  /u\(d\(\{\},o\),\{id:Math\.max\(0,\.\.\.t\.map\(I=>I\.id\)\)\+1\}\)/g,
  'u(d({},o),{contacto:o.tipo==="persona"?o.nombre:o.contacto,id:Math.max(0,...t.map(I=>I.id))+1})'
);

// Reset del formulario en "Agregar" y "Cancelar"
replaceRegex(
  /s\(\{nombre:"",contacto:"",email:"",telefono:""\}\)/g,
  's({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""})'
);

// Botón editar: cargar tipo/rut
replaceRegex(
  /onClick:\(\)=>\{p\(I\.id\),s\(\{nombre:I\.nombre,contacto:I\.contacto,email:I\.email,telefono:I\.telefono\}\)\}/g,
  'onClick:()=>{p(I.id),s({tipo:I.tipo||((I.contacto&&I.contacto!==I.nombre)?"empresa":"persona"),rut:I.rut||"",nombre:I.nombre,contacto:I.contacto,email:I.email,telefono:I.telefono})}'
);

// Buscador sobre tabla
replaceOnce(
  ']}),e.jsx("div",{style:{fontSize:12,color:a.muted,marginBottom:12},children:"­ƒÆí Haz click en un cliente para ver su estado financiero."}),',
  ']}),e.jsx("input",{value:q,onChange:I=>J(I.target.value),placeholder:"Buscar cliente...",style:u(d({},c.inp),{marginBottom:12})}),e.jsx("div",{style:{fontSize:12,color:a.muted,marginBottom:12},children:"­ƒÆí Haz click en un cliente para ver su estado financiero."}),'
);

// Filtrar listado por buscador
replaceOnce(
  'e.jsx("tbody",{children:t.map(I=>{',
  'e.jsx("tbody",{children:t.filter(I=>{var D=(q||"").toLowerCase().trim();return!D||((I.nombre||"").toLowerCase().includes(D)||(I.contacto||"").toLowerCase().includes(D)||(I.email||"").toLowerCase().includes(D)||(I.telefono||"").toLowerCase().includes(D)||(I.rut||"").toLowerCase().includes(D))}).map(I=>{'
);

// Formulario: tipo + rut + contacto condicional
replaceOnce(
  'e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:c.ct,children:m!==null?"Ô£Å Editar":"Ô×ò Nuevo Cliente"}),[["nombre","Nombre / Empresa"],["contacto","Contacto"],["email","Email"],["telefono","Tel├®fono"]].map(([I,D])=>e.jsx(ze,{label:D,children:e.jsx(Pe,{value:o[I],onChange:k=>s(R=>u(d({},R),{[I]:k})),placeholder:D})},I)),',
  'e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:c.ct,children:m!==null?"Ô£Å Editar":"Ô×ò Nuevo Cliente"}),e.jsx(ze,{label:"Tipo",children:e.jsxs("select",{value:o.tipo,onChange:I=>s(R=>u(d({},R),{tipo:I.target.value})),style:c.inp,children:[e.jsx("option",{value:"empresa",children:"Empresa"}),e.jsx("option",{value:"persona",children:"Persona"})]})}),e.jsx(ze,{label:"RUT",children:e.jsx(Pe,{value:o.rut,onChange:I=>s(R=>u(d({},R),{rut:I})),placeholder:"RUT"})}),(o.tipo==="empresa"?[["nombre","Empresa"],["contacto","Contacto"],["email","Email"],["telefono","Tel├®fono"]]:[["nombre","Nombre"],["email","Email"],["telefono","Tel├®fono"]]).map(([I,D])=>e.jsx(ze,{label:D,children:e.jsx(Pe,{value:o[I],onChange:k=>s(R=>u(d({},R),{[I]:k})),placeholder:D})},I)),'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: Clientes form+buscador aplicado (${changed} cambios).`);

