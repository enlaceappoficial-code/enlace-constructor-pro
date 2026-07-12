const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldJBranch = `accion:"\\uD83D\\uDCCB Creado"}]})]),o(Me=>u(d({},Me),{nextNum:Qp+1}))}`;
const newJBranch = `accion:H._isDuplicate?"\\u29C9 Duplicado desde N\\u00B0 "+H._srcId:"\\uD83D\\uDCCB Creado"}]})]),o(Me=>u(d({},Me),{nextNum:Qp+1}))}`;

if (c.includes(oldJBranch)) {
  c = c.replace(oldJBranch, newJBranch);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Replaced J save branch successfully.");
} else {
  console.log("oldJBranch not found!");
}
