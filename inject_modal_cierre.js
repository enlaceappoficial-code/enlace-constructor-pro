const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = 'if (F === "carta") Ef(t, i, r);';
const newStr = 'if (F === "carta") Ef(t, i, r);\\n        else if (F === "cierre") { var B = window.open("", "_blank"); B.document.write(ActaRecepcionHTML(t, i, r)); B.document.close(); }';

if (c.includes(targetStr)) {
  c = c.replace(targetStr, newStr);
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Successfully injected modal click handler for cierre!");
} else {
  console.log("Could not find the target string.");
}
