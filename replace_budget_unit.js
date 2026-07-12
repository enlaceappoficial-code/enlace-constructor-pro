const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const oldInput = `e.jsx("input",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px"}),value:W.unidad,onChange:M=>ee(T,"unidad",M.target.value)})`;
const newSelect = `e.jsx("select",{style:u(d({},c.inp),{fontSize:13,padding:"6px 8px",cursor:"pointer"}),value:W.unidad||"m2",onChange:M=>ee(T,"unidad",M.target.value),children:Array.from(new Set(["m2","m3","ml","un","gl","kg","lt","mes","d\\u00EDa","hr",W.unidad||"m2"])).map(U=>e.jsx("option",{value:U,children:U},U))})`;

if (c.includes(oldInput)) {
  c = c.replace(oldInput, newSelect);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Replaced W.unidad input successfully.");
} else {
  console.log("oldInput not found! Let's try with a more flexible matching.");
}
