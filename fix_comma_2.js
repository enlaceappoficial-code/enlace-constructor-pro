const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('results.length > 0 &&')) {
        if (lines[i-1].includes('})')) {
            if (!lines[i-1].includes('}),')) {
                lines[i-1] = lines[i-1].replace('})', '}),');
            }
        }
    }
}
fs.writeFileSync('src/assets/index.js', lines.join('\n'), 'utf8');
console.log("Comma added properly.");
