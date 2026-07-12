const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// Replace the old Mg licitaciones call with the new Fp2 component
const oldCall = 'e.jsx(Mg,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q})';
const newCall = 'e.jsx(Fp2,{licitaciones:s,setLicitaciones:m,budgets:B,cfg:l,apus:g,materiales:j,catalog:b,setToast:Q,setPage:f})';

if (c.includes(oldCall)) {
  c = c.replace(oldCall, newCall);
  console.log('Replaced Mg with Fp2 in Jg routing: OK');
} else {
  console.error('Could not find the old Mg call. Checking variants...');
  const idx = c.indexOf('e.jsx(Mg,{licitaciones:s');
  if (idx !== -1) {
    console.log('Found at:', idx, c.substring(idx, idx + 200));
  } else {
    console.error('Not found at all');
    process.exit(1);
  }
}

// Verify syntax
try {
  new Function(c);
  console.log('Syntax OK!');
} catch(err) {
  console.log('Syntax check failed:', err.message.substring(0, 150));
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Done!');
