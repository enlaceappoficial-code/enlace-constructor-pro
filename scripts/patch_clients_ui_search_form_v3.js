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

// 1) Buscador en la MISMA fila antes de Exportar/Importar Excel
const exportAnchor =
  'children:[e.jsx("button",{style:u(d({},c.btn("s")),{fontSize:12,padding:"6px 12px"}),onClick:w,children:"📥 Exportar Excel"}),';

replaceOnce(
  exportAnchor,
  'children:[e.jsx("input",{value:q,onChange:I=>J(I.target.value),placeholder:"Buscar cliente...",style:u(d({},c.inp),{width:240})}),e.jsx("button",{style:u(d({},c.btn("s")),{fontSize:12,padding:"6px 12px"}),onClick:w,children:"📥 Exportar Excel"}),'
);

// 2) Formulario Nuevo Cliente (en el módulo Clientes) con tipo Empresa/Persona + RUT + contacto condicional
const formAnchor =
  'e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:c.ct,children:m!==null?"✏ Editar":"➕ Nuevo Cliente"}),[["nombre","Nombre / Empresa"],["contacto","Contacto"],["email","Email"],["telefono","Teléfono"]].map(([I,D])=>e.jsx(ze,{label:D,children:e.jsx(Pe,{value:o[I],onChange:k=>s(R=>u(d({},R),{[I]:k})),placeholder:D})},I)),';

replaceOnce(
  formAnchor,
  'e.jsxs("div",{style:c.card,children:[e.jsx("div",{style:c.ct,children:m!==null?"✏ Editar":"➕ Nuevo Cliente"}),' +
    'e.jsx(ze,{label:"Tipo",children:e.jsxs("select",{value:o.tipo,onChange:I=>s(R=>u(d({},R),{tipo:I.target.value})),style:c.inp,children:[e.jsx("option",{value:"empresa",children:"Empresa"}),e.jsx("option",{value:"persona",children:"Persona"})]})}),' +
    'e.jsx(ze,{label:"RUT",children:e.jsx(Pe,{value:o.rut,onChange:I=>s(R=>u(d({},R),{rut:I})),placeholder:"RUT"})}),' +
    '(o.tipo==="empresa"?[["nombre","Empresa"],["contacto","Contacto"],["email","Email"],["telefono","Teléfono"]]:[["nombre","Nombre"],["email","Email"],["telefono","Teléfono"]]).map(([I,D])=>e.jsx(ze,{label:D,children:e.jsx(Pe,{value:o[I],onChange:k=>s(R=>u(d({},R),{[I]:k})),placeholder:D})},I)),'
);

if (changed === 0) {
  console.log("OK: no hubo cambios.");
  process.exit(0);
}

fs.writeFileSync(filePath, s, "utf8");
console.log(`OK: Clientes UI v3 aplicado (${changed} cambios).`);

