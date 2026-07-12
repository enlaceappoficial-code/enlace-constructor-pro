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

// Botón editar: cargar tipo/rut
replaceRegex(
  /onClick:\(\)=>\{p\(I\.id\),s\(\{nombre:I\.nombre,contacto:I\.contacto,email:I\.email,telefono:I\.telefono\}\)\}/g,
  'onClick:()=>{p(I.id),s({tipo:I.tipo||((I.contacto&&I.contacto!==I.nombre)?"empresa":"persona"),rut:I.rut||"",nombre:I.nombre,contacto:I.contacto,email:I.email,telefono:I.telefono})}'
);

// Cancelar: reset con tipo/rut
replaceRegex(
  /onClick:\(\)=>\{p\(null\),s\(\{nombre:"",contacto:"",email:"",telefono:""\}\)\}/g,
  'onClick:()=>{p(null),s({tipo:"empresa",rut:"",nombre:"",contacto:"",email:"",telefono:""})}'
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

// Header: gráfico + resumen (más compacto)
replaceOnce(
  'e.jsxs("div",{style:c.card,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:c.ct,children:"Top Clientes por Monto"}),e.jsx("span",{style:{fontSize:11,color:a.muted,opacity:.7},children:"(Inicio)"})]}),e.jsx(Lp,{budgets:r,clients:t,cfg:n})]}),',
  'e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 340px",gap:12,marginBottom:16},children:[' +
    'e.jsxs("div",{style:c.card,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:c.ct,children:"Top Clientes por Monto"}),e.jsx("span",{style:{fontSize:11,color:a.muted,opacity:.7},children:"(Inicio)"})]}),e.jsx("div",{style:{transform:"scale(.86)",transformOrigin:"top left"},children:e.jsx(Lp,{budgets:r,clients:t,cfg:n})})]}),' +
    'e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:c.ct,children:"Resumen"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12},children:[' +
      'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Total"}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:a.text},children:t.length})]}),' +
      'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Con presup."}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#f5a020"},children:(()=>{var S=new Set((r||[]).map(O=>O.clienteId));return t.filter(O=>S.has(O.id)).length})()})]}),' +
      'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Con email"}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#38bdf8"},children:t.filter(S=>S.email).length})]}),' +
      'e.jsxs("div",{style:u(d({},c.sc),{padding:"12px 14px",marginBottom:0}),children:[e.jsx("div",{style:{fontSize:11,color:a.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"},children:"Con tel."}),e.jsx("div",{style:{fontSize:22,fontWeight:800,color:"#4ade80"},children:t.filter(S=>S.telefono).length})]})' +
    ']})]}])}),' +
  ']}),'
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
console.log(`OK: Clientes UX aplicado (${changed} cambios).`);

