const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const regex = /regiones\.map\((function \(\w+\) \{|.*?=>)[\s\S]*? Todas"/g;
// actually let's just find "regiones.map"
const idx = c.indexOf('regiones.map');
if (idx > -1) {
  console.log(c.substring(idx - 500, idx + 1000));
} else {
  console.log("Not found");
}
