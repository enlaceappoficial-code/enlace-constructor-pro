const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');
const jgStart = c.indexOf('function Jg(');
const jgCode = c.substring(jgStart);

// Find how the licitaciones tab is rendered
const licTabStr = 'licitaciones';
let pos = 0;
let found = [];
while (true) {
  const idx = jgCode.indexOf(licTabStr, pos);
  if (idx === -1 || idx > 20000) break; // limit search
  found.push({ pos: idx, ctx: jgCode.substring(idx - 10, idx + 60) });
  pos = idx + 1;
}

console.log('Licitaciones references in Jg:');
console.log(JSON.stringify(found, null, 2));

// Also find where Fp2 is referenced
const fp2Refs = [];
pos = 0;
while (true) {
  const idx = jgCode.indexOf('Fp2', pos);
  if (idx === -1) break;
  fp2Refs.push({ pos: idx, ctx: jgCode.substring(idx - 5, idx + 80) });
  pos = idx + 1;
}
console.log('\nFp2 references in Jg:');
console.log(JSON.stringify(fp2Refs, null, 2));
