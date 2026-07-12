const fs = require('fs');
let c = fs.readFileSync('src/assets/index.js', 'utf8');

const targetStr = `      }),
      results.length > 0 &&
                  e.jsx("div", {
                    style: {
                      display: "grid",
                      gap: 16,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(400px, 1fr))",`;

if (c.indexOf(targetStr) !== -1) {
    c = c.replace(targetStr, targetStr.replace('}),', '}),,')); // Add comma! wait, `      }),` has a comma but it's not a comma between array elements.
    // Wait, e.jsxs("div", { children: [ ... ] })
    // If it's inside an array, it's `}), results.length > 0`
    
    // Let's just do:
    c = c.replace(targetStr, `      }),
      results.length > 0 &&
                  e.jsx("div", {
                    style: {
                      display: "grid",
                      gap: 16,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(400px, 1fr))",`);
}

const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('gridTemplateColumns:') && lines[i+1] && lines[i+1].includes('repeat(auto-fill, minmax(400px, 1fr))')) {
        let j = i;
        while (j > 0) {
            j--;
            if (lines[j].includes('results.length > 0 &&')) {
                let k = j;
                while (k > 0) {
                    k--;
                    if (lines[k].trim() === '}),') {
                        lines[k] = '        }),'; // keep the comma
                        break;
                    } else if (lines[k].trim() === '})') {
                        lines[k] = lines[k].replace('})', '}),');
                        break;
                    }
                }
                break;
            }
        }
    }
}
fs.writeFileSync('src/assets/index.js', lines.join('\n'), 'utf8');
console.log("Fixed comma for sure.");
