const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// ========================================================
// Insert Fp2 (Mercado Público component) BEFORE function Jg
// ========================================================
const insertPoint = c.indexOf('function Jg(');
if (insertPoint === -1) { console.error('Cannot find function Jg'); process.exit(1); }

// Read the full Fp2 template from inject_mp_full.js
const origScript = fs.readFileSync('inject_mp_full.js', 'utf8');
// Extract the template literal content (between first backtick of newFp2 and end)
const templateStart = origScript.indexOf('const newFp2 = `') + 'const newFp2 = `'.length;
// Find the end of the template literal - it ends with `;\n
// We'll search for the pattern that closes the template
let depth = 0;
let inTemplate = false;
let templateEnd = -1;
for (let i = templateStart; i < origScript.length - 1; i++) {
  if (origScript[i] === '`' && origScript[i-1] !== '\\') {
    templateEnd = i;
    break;
  }
}

if (templateEnd === -1) { console.error('Cannot find end of template literal'); process.exit(1); }

const newFp2 = origScript.substring(templateStart, templateEnd);

// Check if Fp2 already exists
if (c.includes('function Fp2(props)')) {
  console.log('Fp2 already present, skipping insertion.');
} else {
  c = c.substring(0, insertPoint) + newFp2 + '\n' + c.substring(insertPoint);
  console.log('Fp2 inserted successfully before Jg!');
}

// ========================================================
// STEP 2: Inject saveToKanban function if not present
// ========================================================
if (!c.includes('function saveToKanban(')) {
  const origSaveToKanban = origScript.indexOf('function saveToKanban(');
  if (origSaveToKanban !== -1) {
    // Find end of saveToKanban (next function declaration)
    const nextFn = origScript.indexOf('\nfunction ', origSaveToKanban + 10);
    const saveToKanbanCode = origScript.substring(origSaveToKanban, nextFn !== -1 ? nextFn : origSaveToKanban + 2000);
    // Insert before Fp2
    const fp2Pos = c.indexOf('function Fp2(props)');
    if (fp2Pos !== -1) {
      c = c.substring(0, fp2Pos) + saveToKanbanCode + '\n' + c.substring(fp2Pos);
      console.log('saveToKanban injected!');
    }
  }
}

// Verify file is valid JS
try {
  new Function(c);
  console.log('Syntax OK!');
} catch(err) {
  console.log('Syntax check failed:', err.message);
}

fs.writeFileSync('src/assets/index.js', c, 'utf8');
console.log('Done! File written successfully.');
