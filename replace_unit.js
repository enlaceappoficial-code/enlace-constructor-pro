const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldInput = `e.jsx("input",{style:u(d({},c.inp),{margin:0,padding:"5px 8px",width:70,fontSize:12}),value:y.unidad,onChange:function(A){z(P,"unidad",A.target.value)}})`;
const newSelect = `e.jsx("select",{style:u(d({},c.inp),{margin:0,padding:"5px 8px",width:75,fontSize:12,cursor:"pointer"}),value:y.unidad||"m2",onChange:function(A){z(P,"unidad",A.target.value)},children:Array.from(new Set(["m2","m3","ml","un","gl","kg","lt","mes","día","hr",y.unidad||"m2"])).map(function(U){return e.jsx("option",{value:U,children:U},U)})})`;

if (c.includes(oldInput)) {
  c = c.replace(oldInput, newSelect);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Replaced input with select successfully.");
} else {
  console.log("oldInput not found!");
}
