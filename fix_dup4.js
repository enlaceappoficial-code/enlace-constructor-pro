const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldStr = 'accion:"📋 Creado"}]})]),o(Me=>u(d({},Me),{nextNum:Qp+1}))}';
const newStr = 'accion:H._isDuplicate?"⧉ Duplicado desde N° "+H._srcId:"📋 Creado"}]})]),o(Me=>u(d({},Me),{nextNum:Qp+1}))}';

if (c.includes(oldStr)) {
  c = c.replace(oldStr, newStr);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Replaced correctly!");
} else {
  console.log("oldStr not found!");
}
