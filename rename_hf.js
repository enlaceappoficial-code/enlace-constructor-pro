const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

let count = 0;
// Replace function definition
if (c.includes('function Hf(t, i, r) {') || c.includes('function Hf(t,i,r){')) {
  c = c.replace(/function Hf\(t,\s*i,\s*r\)\s*\{/g, 'function ActaRecepcionHTML(t,i,r){');
  count++;
}

// Replace the call in ternary operators
if (c.includes('h(Hf(j, F, r))') || c.includes('h(Hf(j,F,r))')) {
  c = c.replace(/h\(Hf\(j,\s*F,\s*r\)\)/g, 'h(ActaRecepcionHTML(j,F,r))');
  count++;
}

if (count > 0) {
  fs.writeFileSync('src/assets/index.js', c, 'utf8');
  console.log("Renamed Hf to ActaRecepcionHTML successfully. " + count + " replacements made.");
} else {
  console.log("Could not find Hf to replace.");
}
