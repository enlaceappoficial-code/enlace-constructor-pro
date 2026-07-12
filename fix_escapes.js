const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

// The write_to_file wrote literal backslashes. We need to unescape them.
// Replace \` with `
c = c.replace(/\\`/g, '`');
// Replace \$ with $
c = c.replace(/\\\$/g, '$');

fs.writeFileSync('src/assets/index.js', c);
console.log("Fixed literal escapes.");
