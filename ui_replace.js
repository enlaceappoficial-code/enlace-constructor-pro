const fs = require('fs');

const file = 'src/assets/index.js';
let content = fs.readFileSync(file, 'utf8');

// The exact string to replace in the UI component
const target = 'e.jsx("div",{style:{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"},children:F.map(v=>e.jsx("button",{onClick:()=>j(v),style:{fontSize:10,padding:"2px 8px",borderRadius:99,border:"none",cursor:"pointer",fontWeight:600,background:h===v?o.accent:o.sb,color:h===v?"#000":o.text,border:\`0.5px solid \${h===v?"transparent":o.border}\`,transition:"all .15s"},children:v},v))})';

// The replacement (a select dropdown)
const replacement = 'e.jsxs("div",{style:{marginTop:8},children:[e.jsx("select",{value:h,onChange:v=>j(v.target.value),style:u(d({},s.inp),{width:"100%",fontSize:12,padding:"6px 10px",borderRadius:6,border:\`1px solid \${o.border}\`,background:o.sb,color:o.text,cursor:"pointer",boxSizing:"border-box"}),children:F.sort().map(v=>e.jsx("option",{value:v,children:v},v))})]})\n';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully replaced UI button pill block with select block.');
} else {
  console.log('Target string not found. The file may have already been modified or the minified structure is different.');
}
