const fs = require('fs');
const c = fs.readFileSync('src/assets/index.js', 'utf8');
const match = c.match(/\{id:\"presupuestos\",icon:[^}]+}/);
if (match) {
    console.log(c.substring(Math.max(0, match.index - 200), match.index + 500));
}
