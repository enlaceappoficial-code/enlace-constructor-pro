const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'children:[e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",textAlign:"right",borderColor:W._cid&&U?"#7c2d12":void 0}),type:"number",value:W.precio,onChange:M=>ee(T,"precio",M.target.value),min:"0"})';

const to =
  'children:[e.jsx("select",{value:W._tipoCosto||(W._cid?"auto":"mo"),onChange:M=>ee(T,"_tipoCosto",M.target.value),style:u(d({},c.inp),{fontSize:11,padding:"6px 6px",width:64,marginRight:6,background:a.sb,color:a.text,borderColor:a.border}),children:[e.jsx("option",{value:"auto",children:"AUTO"}),e.jsx("option",{value:"mo",children:"MO"}),e.jsx("option",{value:"mat",children:"MAT"})]}),e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",textAlign:"right",borderColor:W._cid&&U?"#7c2d12":void 0}),type:"number",value:W.precio,onChange:M=>ee(T,"precio",M.target.value),min:"0"})';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");
