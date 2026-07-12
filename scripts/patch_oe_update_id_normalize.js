const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) process.exit(1);

let s = fs.readFileSync(filePath, "utf8");
const before = s;

const from =
  'var Kg=H._newId&&H._newId!==k.id?H._newId:k.id,Zg=u(d({},H),{_newId:void 0,customId:void 0});w(B.map(Me=>Me.id===k.id?u(d({},Zg),{id:Kg}):Me))';

const to =
  'var Kg=H._newId&&parseInt(H._newId)!==parseInt(k.id)?parseInt(H._newId):k.id,Zg=u(d({},H),{id:Kg,_newId:void 0,customId:void 0});if(parseInt(Kg)!==parseInt(k.id)&&B.some(Me=>parseInt(Me.id)===parseInt(Kg)&&parseInt(Me.id)!==parseInt(k.id))){Q("Ya existe un presupuesto con ese N°");return}w(B.map(Me=>parseInt(Me.id)===parseInt(k.id)?Zg:Me))';

if (!s.includes(from)) process.exit(2);
s = s.split(from).join(to);

if (s === before) process.exit(3);
fs.writeFileSync(filePath, s, "utf8");

