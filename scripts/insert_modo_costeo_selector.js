const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'e.jsx(ze,{label:"Fecha",children:e.jsx(Pe,{type:"date",value:I.fecha,onChange:W=>D(T=>u(d({},T),{fecha:W}))})}),m&&';

const to =
  'e.jsx(ze,{label:"Fecha",children:e.jsx(Pe,{type:"date",value:I.fecha,onChange:W=>D(T=>u(d({},T),{fecha:W}))})}),e.jsx(ze,{label:"Modo",children:e.jsx(Mi,{value:I.modoCosteo||"completo",onChange:W=>D(T=>u(d({},T),{modoCosteo:W})),children:[e.jsx("option",{value:"completo",children:"Completo"}),e.jsx("option",{value:"mo",children:"Solo MO"}),e.jsx("option",{value:"separado",children:"Separado"})]})}),m&&';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");
