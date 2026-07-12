const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const changes = [
  {
    from: 'pctMO:Ip[s[0]]||50,pctGG:12,pctUtilidad:15,materiales:[]});',
    to: 'pctMO:Ip[s[0]]||50,pctGG:12,pctUtilidad:15,pctSource:"cfg",materiales:[]});',
  },
  {
    from: 'pctMO:_.pctMO,pctGG:_.pctGG,pctUtilidad:_.pctUtilidad,materiales:_.materiales.map(ue=>d({},ue))})',
    to: 'pctMO:_.pctMO,pctGG:_.pctGG,pctUtilidad:_.pctUtilidad,pctSource:_.pctSource||"cfg",materiales:_.materiales.map(ue=>d({},ue))})',
  },
  {
    from: 'pctMO:parseFloat(b.pctMO)||0,pctGG:parseFloat(b.pctGG)||0,pctUtilidad:parseFloat(b.pctUtilidad)||0,rendimiento:parseFloat(R)||0',
    to: 'pctMO:parseFloat(b.pctMO)||0,pctGG:parseFloat(b.pctGG)||0,pctUtilidad:parseFloat(b.pctUtilidad)||0,pctSource:b.pctSource||"cfg",rendimiento:parseFloat(R)||0',
  },
  {
    from: 'e.jsx(ze,{label:"MO (%)",children:e.jsx(Pe,{type:"number",value:b.pctMO,onChange:E("pctMO"),placeholder:"50"})}),',
    to: 'e.jsx(ze,{label:"Fuente %",children:e.jsxs(Mi,{value:b.pctSource||"cfg",onChange:E("pctSource"),children:[e.jsx("option",{value:"cfg",children:"Configuración"}),e.jsx("option",{value:"apu",children:"Personalizado"})]})}),e.jsx(ze,{label:"MO (%)",children:e.jsx(Pe,{type:"number",value:b.pctMO,onChange:E("pctMO"),placeholder:"50"})}),',
  },
];

let ok = false;
for (const c of changes) {
  if (s.includes(c.from)) {
    s = s.split(c.from).join(c.to);
    ok = true;
  }
}

if (!ok) process.exit(2);
if (s === before) process.exit(3);

fs.writeFileSync(filePath, s, "utf8");

